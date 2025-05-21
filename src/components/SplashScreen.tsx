import { motion } from 'framer-motion';

const colors = [
  '#FF6B6B', // red
  '#FFD93D', // yellow
  '#6BCB77', // green
  '#4D96FF', // blue
  '#FF6F91', // pink
  '#FF914D', // orange
  '#A66CFF', // purple
];

export default function SplashScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-200 via-yellow-100 to-blue-200">
      <motion.h1
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1 }}
        className="text-5xl md:text-7xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-yellow-400 to-blue-500 drop-shadow-lg"
      >
        Color Voice Game
      </motion.h1>
      <motion.div
        className="flex gap-3 mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        {colors.map((color, i) => (
          <motion.div
            key={color}
            className="w-8 h-8 rounded-full shadow-lg"
            style={{ background: color }}
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.1 }}
          />
        ))}
      </motion.div>
      <motion.p
        className="mt-10 text-lg text-gray-700 font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        Get ready to play with colors and your voice!
      </motion.p>
    </div>
  );
} 