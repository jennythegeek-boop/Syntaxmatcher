import { Language, SegmentColor } from './types';

export const SUPPORTED_LANGUAGES: Language[] = [
  Language.ENGLISH,
  Language.ITALIAN,
  Language.DANISH,
  Language.FRENCH,
  Language.KOREAN,
  Language.CHINESE,
];

// A palette of distinct colors for syntax highlighting
// We use Tailwind classes mapped to IDs.
export const SEGMENT_COLORS: SegmentColor[] = [
  { bg: 'bg-red-500/20', text: 'text-red-200', border: 'border-red-500/40' },
  { bg: 'bg-orange-500/20', text: 'text-orange-200', border: 'border-orange-500/40' },
  { bg: 'bg-amber-500/20', text: 'text-amber-200', border: 'border-amber-500/40' },
  { bg: 'bg-yellow-500/20', text: 'text-yellow-200', border: 'border-yellow-500/40' },
  { bg: 'bg-lime-500/20', text: 'text-lime-200', border: 'border-lime-500/40' },
  { bg: 'bg-green-500/20', text: 'text-green-200', border: 'border-green-500/40' },
  { bg: 'bg-emerald-500/20', text: 'text-emerald-200', border: 'border-emerald-500/40' },
  { bg: 'bg-teal-500/20', text: 'text-teal-200', border: 'border-teal-500/40' },
  { bg: 'bg-cyan-500/20', text: 'text-cyan-200', border: 'border-cyan-500/40' },
  { bg: 'bg-sky-500/20', text: 'text-sky-200', border: 'border-sky-500/40' },
  { bg: 'bg-blue-500/20', text: 'text-blue-200', border: 'border-blue-500/40' },
  { bg: 'bg-indigo-500/20', text: 'text-indigo-200', border: 'border-indigo-500/40' },
  { bg: 'bg-violet-500/20', text: 'text-violet-200', border: 'border-violet-500/40' },
  { bg: 'bg-purple-500/20', text: 'text-purple-200', border: 'border-purple-500/40' },
  { bg: 'bg-fuchsia-500/20', text: 'text-fuchsia-200', border: 'border-fuchsia-500/40' },
  { bg: 'bg-pink-500/20', text: 'text-pink-200', border: 'border-pink-500/40' },
  { bg: 'bg-rose-500/20', text: 'text-rose-200', border: 'border-rose-500/40' },
];

export const NEUTRAL_COLOR: SegmentColor = {
  bg: 'bg-slate-800/50',
  text: 'text-slate-400',
  border: 'border-transparent'
};