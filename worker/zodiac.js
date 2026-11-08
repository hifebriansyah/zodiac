// zodiac-worker.situs.id: personalised astrology readings written by Gemini, in Bahasa Indonesia.
//   GET /reading/{sign}/{era}/{career}/{date}   one reading (date = YYYYMMDD)
//   GET /reading/general/{date}                 the general reading of all 12 signs
// Each reading is a file in the R2 bucket (binding READINGS): {slug}.json. The file is read first; Gemini is asked only when it is missing,
// and the answer is saved so the same URL is written once.
// Settings (worker/zodiac.jsonc): AXIOM_DATASET, AXIOM_URL, THINKING_BUDGET, MAX_OUTPUT_TOKENS, the rate limit LIMITER. Secret: GEMINI_API_KEY (Cloudflare dashboard).

const MODEL = "gemini-3.8-flash";  // always this model: no fallback to another one

const SIGNS = ["aries", "taurus", "gemini", "cancer", "leo", "virgo", "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces"];
const ERAS = { explorer: "Explorer (masa menjelajah, awal usia 20-an, mencari jati diri)", builder: "Builder (masa membangun, 30-an, membangun karier dan keluarga)", executive: "Executive (masa memimpin, 40-an sampai 50-an, memegang tanggung jawab besar)", sage: "Sage (masa bijak, 60 tahun ke atas, berbagi pengalaman dan kebijaksanaan)" };
const CAREERS = { professional: "Professional (karyawan/spesialis di dalam organisasi)", leader: "Leader (manajer atau pemimpin tim/organisasi)", independent: "Independent (pengusaha, freelancer, pekerja mandiri)", public: "Public (figur publik, kreator, pelayan masyarakat)" };
const WIB = 7 * 3600;  // Asia/Jakarta, no daylight saving

const CORS = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, OPTIONS", "Access-Control-Allow-Headers": "Content-Type" };

class GeminiError extends Error {
  constructor(message, status) { super(message); this.status = status; }
}

// ---------- the JSON Gemini must return ----------
const STR = { type: "STRING" };
const TIME = { type: "STRING", description: "HH:MM, in 15-minute steps" };
const BLOCK = { type: "OBJECT", properties: { from: TIME, to: TIME, title: STR, description: STR }, required: ["from", "to", "title", "description"], propertyOrdering: ["from", "to", "title", "description"] };
const BLOCKS = { type: "ARRAY", items: BLOCK };
const READINGS = { type: "OBJECT", properties: { general: STR, career: STR, economy: STR }, required: ["general", "career", "economy"], propertyOrdering: ["general", "career", "economy"] };
const MOOD = { type: "INTEGER", description: "1 to 10" };

const CORE_SCHEMA = {
  type: "OBJECT",
  properties: {
    lucky_color: STR,
    readings: READINGS,
    moods: { type: "OBJECT", properties: { sex: MOOD, hustle: MOOD, vibe: MOOD, success: MOOD }, required: ["sex", "hustle", "vibe", "success"], propertyOrdering: ["sex", "hustle", "vibe", "success"] },
    routine: BLOCKS,
  },
  required: ["lucky_color", "readings", "moods", "routine"],
  propertyOrdering: ["lucky_color", "readings", "moods", "routine"],
};

function synastrySchema(signs) {
  const item = { type: "OBJECT", properties: { reading: STR, routine: BLOCKS }, required: ["reading", "routine"], propertyOrdering: ["reading", "routine"] };
  return { type: "OBJECT", properties: Object.fromEntries(signs.map((s) => [s, item])), required: signs, propertyOrdering: signs };
}

function generalSchema() {
  return { type: "OBJECT", properties: Object.fromEntries(SIGNS.map((s) => [s, READINGS])), required: SIGNS, propertyOrdering: SIGNS };
}

// ---------- dates ----------
function parseDate(s) {
  if (!/^\d{8}$/.test(s)) return null;
  const y = +s.slice(0, 4), m = +s.slice(4, 6), d = +s.slice(6, 8);
  const t = new Date(Date.UTC(y, m - 1, d));
  if (t.getUTCFullYear() !== y || t.getUTCMonth() !== m - 1 || t.getUTCDate() !== d) return null;
  return { y, m, d, midnight: Date.UTC(y, m - 1, d) / 1000 - WIB };  // 00:00 WIB of that day, in unix seconds
}

const MONTHS = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
const DAYS = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
function dateLabel(p) {
  const dow = new Date(Date.UTC(p.y, p.m - 1, p.d)).getUTCDay();
  return `${DAYS[dow]}, ${p.d} ${MONTHS[p.m - 1]} ${p.y}`;
}

// "HH:MM" blocks -> unix seconds on the given day (WIB). The blocks are checked: valid times, each ends after it starts, in order.
function toRoutine(blocks, date) {
  if (!Array.isArray(blocks) || !blocks.length) throw new Error("routine is empty");
  let last = -1;
  return blocks.map((b) => {
    const f = /^(\d{1,2}):(\d{2})$/.exec(String(b.from)), t = /^(\d{1,2}):(\d{2})$/.exec(String(b.to));
    if (!f || !t || !b.title || !b.description) throw new Error("bad routine block");
    const from = +f[1] * 3600 + +f[2] * 60, to = +t[1] * 3600 + +t[2] * 60;
    if (from < 0 || to > 86400 || to <= from || from < last) throw new Error("routine times out of order");
    last = to;
    return { from: date.midnight + from, to: date.midnight + to, title: String(b.title), description: String(b.description) };
  });
}

// ---------- Gemini ----------
const SYSTEM = `Kamu adalah astrolog harian yang hangat, tajam, dan praktis. Tulis dalam Bahasa Indonesia yang natural dan enak dibaca (bukan terjemahan kaku).
Aturan:
- Setiap teks bacaan 2-4 kalimat, spesifik dan bisa ditindaklanjuti, bukan klise umum. Boleh menyebut posisi planet atau transit secara singkat.
- Jangan menjanjikan hal pasti soal kesehatan, hukum, atau keuangan; ini hiburan dan refleksi.
- Jadwal (routine): urut waktu, tidak tumpang tindih, format jam "HH:MM" kelipatan 15 menit, memakai jam WIB. title singkat (2-5 kata), description 1-2 kalimat.
- Jawab HANYA dengan JSON sesuai skema.`;

function generationConfig(env, schema) {
  const config = { maxOutputTokens: Number(env.MAX_OUTPUT_TOKENS || 12000), temperature: 0.9, responseMimeType: "application/json", responseSchema: schema };
  if (env.THINKING_BUDGET !== undefined && env.THINKING_BUDGET !== "") config.thinkingConfig = { thinkingBudget: Number(env.THINKING_BUDGET) };
  return config;
}

async function askOnce(env, prompt, schema) {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": env.GEMINI_API_KEY },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: SYSTEM }] },
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: generationConfig(env, schema),
    }),
    signal: AbortSignal.timeout(100000),
  });
  const data = await res.json().catch(() => null);
  const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("").trim();
  if (res.ok && text) {
    try { return JSON.parse(text); } catch { throw new GeminiError(`Gemini sent broken JSON (${data?.candidates?.[0]?.finishReason})`, 502); }
  }
  throw new GeminiError(res.ok ? "no answer" : `Gemini ${res.status}${data?.error?.message ? `: ${data.error.message}` : ""}`, res.status || 502);
}

// Retries this model on 429/503 (and a broken answer); it never falls back to another model.
async function ask(env, prompt, schema, check) {
  let err;
  for (let i = 0; i < 4; i++) {
    try {
      const out = await askOnce(env, prompt, schema);
      return check ? check(out) : out;
    } catch (e) {
      err = e;
      const retry = e.status === 429 || e.status === 503 || e.status === 502 || !(e instanceof GeminiError);  // a failed check is a plain Error
      if (!retry) break;
      await new Promise((r) => setTimeout(r, 1500 * (i + 1)));
    }
  }
  throw err;
}

const hasText = (o, keys) => keys.every((k) => typeof o?.[k] === "string" && o[k].trim());
function checkReadings(r) { if (!hasText(r, ["general", "career", "economy"])) throw new Error("incomplete readings"); return r; }

// ---------- generating ----------
async function makeReading(env, p, sign, era, career, date) {
  const profile = `Tanggal: ${dateLabel(date)}.\nZodiak: ${sign}.\nFase hidup (era): ${ERAS[era]}.\nArketipe karier: ${CAREERS[career]}.`;
  const core = ask(env, `${profile}\n\nBuat bacaan harian untuk orang ini pada tanggal tersebut.
- lucky_color: satu warna (nama saja, misalnya "Merah Marun").
- readings.general: bacaan umum hari itu. readings.career: bacaan karier yang menyesuaikan era dan arketipe di atas. readings.economy: prospek keuangan/materi hari itu.
- moods: skor bulat 1-10 untuk sex, hustle, vibe, success (jangan semuanya sama).
- routine: jadwal harian yang dioptimalkan untuk tanggal ini, mulai pukul 00:00 dan berakhir pukul 23:45, 7-10 blok berurutan tanpa celah.`,
    CORE_SCHEMA, (o) => {
      checkReadings(o.readings);
      if (!hasText(o, ["lucky_color"])) throw new Error("no color");
      for (const k of ["sex", "hustle", "vibe", "success"]) if (!Number.isInteger(o.moods?.[k]) || o.moods[k] < 1 || o.moods[k] > 10) throw new Error("bad mood");
      o.routine = toRoutine(o.routine, date);
      if (o.routine[0].from !== date.midnight || o.routine.at(-1).to !== date.midnight + 23 * 3600 + 45 * 60) throw new Error("routine must run 00:00-23:45");
      return o;
    });
  // Twelve partners are too much for one answer, so they are written in two halves at the same time.
  const half = (signs) => ask(env, `${profile}\n\nUntuk orang ini, tulis nasihat hubungan (synastry) dengan pasangan/orang dekat berzodiak: ${signs.join(", ")}.
Untuk setiap zodiak: reading = saran hubungan 2-4 kalimat yang spesifik untuk pasangan ${sign} x zodiak itu pada tanggal ini; routine = jadwal bersama untuk berdua, 3-4 blok berurutan antara 06:00 dan 23:00.`,
    synastrySchema(signs), (o) => {
      for (const s of signs) {
        if (!hasText(o[s], ["reading"])) throw new Error(`no synastry for ${s}`);
        o[s].routine = toRoutine(o[s].routine, date);
      }
      return o;
    });
  const [c, a, b] = await Promise.all([core, half(SIGNS.slice(0, 6)), half(SIGNS.slice(6))]);
  const synastry = {};
  for (const s of SIGNS) synastry[s] = (a[s] || b[s]);
  return { slug: p.slug, lucky_color: c.lucky_color, readings: c.readings, moods: c.moods, routine: c.routine, synastry };
}

async function makeGeneral(env, p, date) {
  const out = await ask(env, `Tanggal: ${dateLabel(date)}.\n\nBuat bacaan umum harian untuk semua 12 zodiak (${SIGNS.join(", ")}) pada tanggal tersebut. Untuk setiap zodiak:
general = bacaan umum, career = bacaan karier, economy = prospek keuangan/materi. Setiap zodiak harus terasa berbeda.`,
    generalSchema(), (o) => { for (const s of SIGNS) checkReadings(o[s]); return o; });
  return { slug: p.slug, signs: out };
}

// ---------- worker ----------
const json = (obj, status = 200, extra = {}) => new Response(JSON.stringify(obj), { status, headers: { ...CORS, "Content-Type": "application/json; charset=utf-8", ...extra } });

// Request log (Axiom, when AXIOM_TOKEN is set): one line per request into the shared dataset logs.situs.id; "origin" says which worker wrote it.
function logLine(env, ctx, event) {
  if (!env.AXIOM_TOKEN) return;
  const url = `${env.AXIOM_URL || "https://us-east-1.aws.edge.axiom.co"}/v1/ingest/${encodeURIComponent(env.AXIOM_DATASET || "logs.situs.id")}`;
  ctx.waitUntil(fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${env.AXIOM_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify([{ _time: new Date().toISOString(), origin: "zodiac-worker.situs.id", ...event }]),
  }).catch(() => {}));  // a lost log line never breaks an answer
}

export default {
  async fetch(request, env, ctx) {
    const started = Date.now();
    const info = {};
    const res = await handle(request, env, info);
    logLine(env, ctx, { method: request.method, path: new URL(request.url).pathname, status: res.status, ms: Date.now() - started, ...info });
    return res;
  },
};

async function handle(request, env, info) {
  {
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
    if (request.method !== "GET" && request.method !== "HEAD") return json({ error: "method not allowed" }, 405, { Allow: "GET, HEAD, OPTIONS" });

    const parts = new URL(request.url).pathname.split("/").filter(Boolean).map((s) => decodeURIComponent(s).toLowerCase());
    if (parts[0] !== "reading") return json({ error: "not found" }, 404);

    let slug, build;
    let date;
    if (parts.length === 3 && parts[1] === "general") {
      date = parseDate(parts[2]);
      if (!date) return json({ error: "date must be a real date in YYYYMMDD format" }, 400);
      slug = `general-readings-${parts[2]}`; info.kind = "general"; info.slug = slug;
      build = () => makeGeneral(env, { slug }, date);
    } else if (parts.length === 5) {
      const [, sign, era, career, d] = parts;
      const problems = [];
      if (!SIGNS.includes(sign)) problems.push(`sign must be one of: ${SIGNS.join(", ")}`);
      if (!ERAS[era]) problems.push(`era must be one of: ${Object.keys(ERAS).join(", ")}`);
      if (!CAREERS[career]) problems.push(`career must be one of: ${Object.keys(CAREERS).join(", ")}`);
      date = parseDate(d);
      if (!date) problems.push("date must be a real date in YYYYMMDD format");
      if (problems.length) return json({ error: problems.join("; ") }, 400);
      slug = `${sign}-${era}-${career}-${d}`; info.kind = "reading"; info.slug = slug;
      build = () => makeReading(env, { slug }, sign, era, career, date);
    } else {
      return json({ error: "not found" }, 404);
    }

    // The file first: a saved reading is returned as it is, and Gemini is not asked.
    const file = await env.READINGS.get(`${slug}.json`);
    if (file) info.cache = "HIT";
    if (file) return new Response(request.method === "HEAD" ? null : file.body, { headers: { ...CORS, "Content-Type": "application/json; charset=utf-8", "Cache-Control": "public, max-age=3600", "X-Cache": "HIT" } });

    if (!env.GEMINI_API_KEY) return json({ error: "not configured" }, 503);
    const ip = request.headers.get("CF-Connecting-IP") || "unknown";
    if (env.LIMITER && !(await env.LIMITER.limit({ key: ip })).success) { info.error = "rate limited"; return json({ error: "too many new readings, try again in a minute" }, 429, { "Retry-After": "60" }); }

    info.cache = "MISS";
    let reading;
    try {
      reading = await build();
    } catch (err) {
      info.error = String(err.message || err).slice(0, 300);
      const status = err.status === 429 ? 503 : 502;
      return json({ error: "could not write the reading", detail: String(err.message || err).slice(0, 300) }, status, { "Retry-After": "30" });
    }
    const body = JSON.stringify(reading);
    await env.READINGS.put(`${slug}.json`, body, { httpMetadata: { contentType: "application/json" } });
    return new Response(request.method === "HEAD" ? null : body, { headers: { ...CORS, "Content-Type": "application/json; charset=utf-8", "Cache-Control": "public, max-age=3600", "X-Cache": "MISS" } });
  }
}
