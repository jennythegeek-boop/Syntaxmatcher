import React from 'react';
import { Segment, SegmentColor } from '../types';
import { SEGMENT_COLORS, NEUTRAL_COLOR } from '../constants';

interface SegmentDisplayProps {
  segment: Segment;
  hoveredMatchId: number | null;
  onHover: (id: number | null) => void;
}

const SegmentDisplay: React.FC<SegmentDisplayProps> = ({ segment, hoveredMatchId, onHover }) => {
  // Determine color based on matchId
  const colorIndex = segment.matchId > 0 ? (segment.matchId - 1) % SEGMENT_COLORS.length : -1;
  const color: SegmentColor = colorIndex >= 0 ? SEGMENT_COLORS[colorIndex] : NEUTRAL_COLOR;

  // Highlighting logic
  const isHovered = hoveredMatchId !== null && hoveredMatchId === segment.matchId && segment.matchId !== 0;
  const isDimmed = hoveredMatchId !== null && hoveredMatchId !== segment.matchId;
  
  // Dynamic classes
  const baseClasses = "inline-block px-1.5 py-0.5 mx-0.5 my-1 rounded border cursor-pointer transition-all duration-200 text-sm md:text-base font-medium select-none";
  
  let stateClasses = "";
  if (isHovered) {
    stateClasses = `${color.bg} ${color.text} ${color.border} ring-2 ring-offset-2 ring-offset-slate-900 ring-brand-500 scale-110 shadow-lg z-10`;
  } else if (segment.matchId === 0) {
     stateClasses = `${color.bg} ${color.text} ${color.border} opacity-60`;
  } else {
    // Default state (color coded but not hovered)
    // If something else is hovered, dim this one.
    stateClasses = isDimmed 
      ? `${color.bg} ${color.text} ${color.border} opacity-30 grayscale` 
      : `${color.bg} ${color.text} ${color.border}`;
  }

  return (
    <span
      className={`${baseClasses} ${stateClasses}`}
      onMouseEnter={() => segment.matchId > 0 && onHover(segment.matchId)}
      onMouseLeave={() => onHover(null)}
    >
      {segment.text}
    </span>
  );
};

export default SegmentDisplay;
