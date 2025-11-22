export enum Language {
  ENGLISH = 'English',
  ITALIAN = 'Italian',
  DANISH = 'Danish',
  FRENCH = 'French',
  KOREAN = 'Korean',
  CHINESE = 'Mandarin Chinese',
}

export interface Segment {
  text: string;
  matchId: number; // 0 or -1 if no match, otherwise a positive integer linking concepts
}

export interface TranslatedLanguageResult {
  language: string;
  segments: Segment[];
}

export interface TranslationResponse {
  sourceSegments: Segment[];
  translations: TranslatedLanguageResult[];
}

export interface SegmentColor {
  bg: string;
  text: string;
  border: string;
}