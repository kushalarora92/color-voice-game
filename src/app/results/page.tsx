"use client";
import { useEffect, useState } from 'react';
import { useGame } from '../../context/GameContext';
import ResultCard from '../../components/ResultCard';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function ResultsPage() {
  const { answers, reset } = useGame();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  const score = answers.filter((a) => a.correct).length;
  const total = answers.length;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-200 via-yellow-100 to-blue-200">
        <motion.div
          className="w-24 h-24 rounded-full border-8 border-pink-400 border-t-yellow-300 animate-spin mb-8"
          aria-label="Loading results..."
        />
        <span className="text-2xl font-bold text-blue-600">Evaluating your answers...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-pink-200 via-yellow-100 to-blue-200 px-4 pb-12">
      <ResultCard score={score} total={total} details={answers} />
      <button
        className="mt-8 px-10 py-4 rounded-full bg-gradient-to-r from-green-400 via-blue-400 to-purple-500 text-white text-2xl font-bold shadow-lg hover:scale-105 transition-transform"
        aria-label="Play Again"
        onClick={() => {
          reset();
          router.push('/');
        }}
      >
        🔄 Play Again
      </button>
    </div>
  );
} 