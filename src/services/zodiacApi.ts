import {
  buildFallbackGeneralReadings,
  buildFallbackReading,
} from '../data/zodiacMeta';
import {
  CareerArchetype,
  GeneralReadingResponse,
  LifeEra,
  ReadingResponse,
  ZodiacSignId,
} from '../types/zodiac';

const DEFAULT_BASE_URL = 'https://zodiac-worker.situs.id';

export function getApiBaseUrl(): string {
  const envUrl = import.meta.env?.VITE_API_BASE_URL;
  return (envUrl ? String(envUrl).replace(/\/+$/, '') : DEFAULT_BASE_URL);
}

const STORAGE_PREFIX = 'astraea_cache_v1_';

function getLocalCache<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function setLocalCache<T>(key: string, data: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
  } catch {
    // Ignore storage quota errors
  }
}

export async function fetchGeneralReadings(
  dateParam: string,
  options?: { bust?: boolean; signal?: AbortSignal }
): Promise<GeneralReadingResponse> {
  const cacheKey = `general_${dateParam}`;
  if (!options?.bust) {
    const cached = getLocalCache<GeneralReadingResponse>(cacheKey);
    if (cached && Array.isArray(cached.readings) && cached.readings.length === 12) {
      return { ...cached, _source: 'cached' };
    }
  }

  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}/reading/general/${dateParam}`;

  try {
    const res = await fetch(url, {
      method: 'GET',
      signal: options?.signal,
    });
    if (!res.ok) {
      throw new Error(`API ${res.status}`);
    }
    const data = (await res.json()) as GeneralReadingResponse;
    if (data && Array.isArray(data.readings)) {
      const enriched: GeneralReadingResponse = { ...data, _source: 'live' };
      setLocalCache(cacheKey, enriched);
      return enriched;
    }
    throw new Error('Invalid general reading payload');
  } catch {
    const cached = getLocalCache<GeneralReadingResponse>(cacheKey);
    if (cached) return { ...cached, _source: 'cached' };
    return {
      slug: `general-readings-${dateParam}`,
      readings: buildFallbackGeneralReadings(dateParam),
      _source: 'editorial-preview',
    };
  }
}

export async function fetchSignReading(
  sign: ZodiacSignId,
  era: LifeEra,
  career: CareerArchetype,
  dateParam: string,
  options?: { bust?: boolean; signal?: AbortSignal }
): Promise<ReadingResponse> {
  const cacheKey = `reading_${sign}_${era}_${career}_${dateParam}`;
  if (!options?.bust) {
    const cached = getLocalCache<ReadingResponse>(cacheKey);
    if (cached && cached.reading && Array.isArray(cached.routine) && Array.isArray(cached.synastries)) {
      return { ...cached, _source: 'cached' };
    }
  }

  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}/reading/${sign}/${era}/${career}/${dateParam}`;

  try {
    const res = await fetch(url, {
      method: 'GET',
      signal: options?.signal,
    });
    if (!res.ok) {
      throw new Error(`API ${res.status}`);
    }
    const data = (await res.json()) as ReadingResponse;
    if (data && data.reading && Array.isArray(data.routine)) {
      const enriched: ReadingResponse = { ...data, _source: 'live' };
      setLocalCache(cacheKey, enriched);
      return enriched;
    }
    throw new Error('Invalid reading response payload');
  } catch {
    const cached = getLocalCache<ReadingResponse>(cacheKey);
    if (cached) return { ...cached, _source: 'cached' };
    return buildFallbackReading(sign, era, career, dateParam);
  }
}
