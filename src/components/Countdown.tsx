import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const steps = ['3', '2', '1', 'Go!'];
const colors = [
  'text-red-500',
  'text-yellow-400',
  'text-green-500',
  'text-blue-500',
];
const durations = [1000, 1000, 1000, 1200]; // ms for each step

export default function Countdown({ onComplete }: { onComplete: () => void }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < steps.length - 1) {
      const timeout = setTimeout(() => setIndex(index + 1), durations[index]);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => onComplete(), durations[index]);
      return () => clearTimeout(timeout);
    }
  }, [index, onComplete]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
      <AnimatePresence mode="wait">
        <motion.span
          key={steps[index]}
          className={`text-7xl md:text-9xl font-extrabold ${colors[index]} drop-shadow-lg`}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1.2, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {steps[index]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
} 