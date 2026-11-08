export type ZodiacSignId =
  | 'aries'
  | 'taurus'
  | 'gemini'
  | 'cancer'
  | 'leo'
  | 'virgo'
  | 'libra'
  | 'scorpio'
  | 'sagittarius'
  | 'capricorn'
  | 'aquarius'
  | 'pisces';

export type LifeEra = 'explorer' | 'builder' | 'executive' | 'sage';

export type CareerArchetype = 'professional' | 'leader' | 'independent' | 'public';

export type EncounterType =
  | 'family'
  | 'couple'
  | 'friends'
  | 'colleagues'
  | 'boss'
  | 'subordinates'
  | 'clients';

export type ZodiacElement = 'Fire' | 'Earth' | 'Air' | 'Water';

export interface RoutineItem {
  from: number; // Unix timestamp in seconds
  to: number;   // Unix timestamp in seconds
  title: string;
  description: string;
}

export interface EncounterItem {
  type: EncounterType;
  rating: number; // 1-10
  description: string;
}

export interface SynastryItem {
  sign: ZodiacSignId;
  encounters: EncounterItem[]; // Always 7 items
  routine: RoutineItem[];
}

export interface ReadingObject {
  sign: ZodiacSignId;
  general: string;
  career: string;
  economy: string;
  family: string;
}

export interface MoodScores {
  sex: number;     // 1-10
  hustle: number;  // 1-10
  vibe: number;    // 1-10
  success: number; // 1-10
}

export interface ReadingResponse {
  slug: string;
  lucky_color: string;
  reading: ReadingObject;
  mood: MoodScores;
  routine: RoutineItem[];
  synastries: SynastryItem[];
  _source?: 'live' | 'cached' | 'editorial-preview';
}

export interface GeneralReadingResponse {
  slug: string;
  readings: ReadingObject[];
  _source?: 'live' | 'cached' | 'editorial-preview';
}

export interface ZodiacSignMetadata {
  id: ZodiacSignId;
  name: string;
  indonesianName: string;
  glyph: string;
  symbolLatin: string;
  dateRange: string;
  element: ZodiacElement;
  modality: 'Cardinal' | 'Fixed' | 'Mutable';
  rulingPlanet: string;
  houseNumber: string;
  harmonicHz: number;
  chordNotes: number[];
  auraTagline: string;
  accentHex: string;
  secondaryHex: string;
  badgeClass: string;
  gridSpanClass: string;
  editorialQuote: string;
}
