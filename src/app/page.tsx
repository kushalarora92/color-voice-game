"use client";
import { useEffect, useState } from 'react';
import SplashScreen from '../components/SplashScreen';
import { motion } from 'framer-motion';
import Link from 'next/link';

function HomeScreen() {
  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-200 via-yellow-100 to-blue-200"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
    >
      <h2 className="text-4xl md:text-6xl font-extrabold mb-8 text-blue-600 drop-shadow-lg">Welcome!</h2>
      <p className="mb-8 text-lg text-gray-700">Test your color perception and voice skills!</p>
      <Link href="/game">
        <button className="px-8 py-4 rounded-full bg-gradient-to-r from-pink-500 via-yellow-400 to-blue-500 text-white text-2xl font-bold shadow-lg hover:scale-105 transition-transform">
          Start Game
        </button>
      </Link>
    </motion.div>
  );
}

export default function Page() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return showSplash ? <SplashScreen /> : <HomeScreen />;
}
