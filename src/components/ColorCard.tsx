import React from 'react';

export interface ColorCardProps {
  word: string;
  color: string;
}

export default function ColorCard({ word, color }: ColorCardProps) {
  return (
    <div className="flex items-center justify-center h-40 md:h-56">
      <span
        className="text-5xl md:text-7xl font-extrabold px-10 py-6 rounded-xl shadow-lg bg-white"
        style={{ color }}
        aria-label={`Word '${word}' is shown in color ${color}`}
      >
        {word}
      </span>
    </div>
  );
} 