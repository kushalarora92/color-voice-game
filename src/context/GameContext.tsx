"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Color = 'red' | 'yellow' | 'green' | 'blue' | 'pink' | 'orange' | 'purple';

export interface GameQuestion {
  word: Color;
  color: Color;
}

export interface GameAnswer {
  word: Color;
  color: Color;
  user: string;
  correct: boolean;
}

interface GameContextType {
  questions: GameQuestion[];
  answers: GameAnswer[];
  current: number;
  next: (userAnswer: string) => void;
  reset: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const COLORS: Color[] = ['red', 'yellow', 'green', 'blue', 'pink', 'orange', 'purple'];

function getRandomColor(): Color {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

function generateQuestions(count: number): GameQuestion[] {
  return Array.from({ length: count }, () => {
    const word = getRandomColor();
    let color: Color;
    do {
      color = getRandomColor();
    } while (color === word);
    return { word, color };
  });
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [questions, setQuestions] = useState<GameQuestion[]>(() => generateQuestions(10));
  const [answers, setAnswers] = useState<GameAnswer[]>([]);
  const [current, setCurrent] = useState(0);

  const next = (userAnswer: string) => {
    const q = questions[current];
    const correct = userAnswer.trim().toLowerCase() === q.color;
    setAnswers((prev) => [
      ...prev,
      { word: q.word, color: q.color, user: userAnswer, correct },
    ]);
    setCurrent((c) => c + 1);
  };

  const reset = () => {
    setQuestions(generateQuestions(10));
    setAnswers([]);
    setCurrent(0);
  };

  return (
    <GameContext.Provider value={{ questions, answers, current, next, reset }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
} 