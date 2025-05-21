"use client";
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGame } from '../../context/GameContext';
import ColorCard from '../../components/ColorCard';
import Countdown from '../../components/Countdown';

const COLOR_LABELS = {
  red: 'Red',
  yellow: 'Yellow',
  green: 'Green',
  blue: 'Blue',
  pink: 'Pink',
  orange: 'Orange',
  purple: 'Purple',
};

// Minimal type definitions for Web Speech API

type SpeechRecognition = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
  start: () => void;
  abort: () => void;
};

type SpeechRecognitionEvent = {
  results: { [key: number]: { [key: number]: { transcript: string } } };
};

type SpeechRecognitionErrorEvent = {
  error: string;
};

export default function GamePage() {
  const { questions, current, next } = useGame();
  const router = useRouter();
  const [micAllowed, setMicAllowed] = useState(false);
  const [checkingMic, setCheckingMic] = useState(true);
  const [showCountdown, setShowCountdown] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [error, setError] = useState('');
  const [shouldListen, setShouldListen] = useState(false);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const stopRequested = useRef(false);
  const isMounted = useRef(true);

  // Check mic permissions
  useEffect(() => {
    async function checkMic() {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setMicAllowed(true);
      } catch {
        setMicAllowed(false);
      } finally {
        setCheckingMic(false);
      }
    }
    checkMic();
    return () => { isMounted.current = false; };
  }, []);

  // Create SpeechRecognition instance once
  useEffect(() => {
    if (!micAllowed) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognitionCtor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) {
      setError('Speech Recognition not supported in this browser.');
      return;
    }
    const recognition: SpeechRecognition = new SpeechRecognitionCtor();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;
    return () => {
      recognitionRef.current?.abort();
      recognitionRef.current = null;
    };
  }, [micAllowed]);

  // Start listening when shouldListen is true
  useEffect(() => {
    if (!shouldListen || !recognitionRef.current) return;
    setUserAnswer('');
    setError('');
    stopRequested.current = false;
    let hadError = false;
    const recognition = recognitionRef.current;
    let ended = false;
    let isRecognitionRunning = false;
    setListening(true);
    recognition.onstart = () => {
      isRecognitionRunning = true;
    };
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      if (!isMounted.current) return;
      const transcript = event.results[0][0].transcript;
      setUserAnswer(transcript);
    };
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (!isMounted.current) return;
      let message = 'Could not recognize speech. Try again!';
      if (event.error === 'no-speech') {
        message = 'No speech detected. Please try again.';
      } else if (event.error === 'audio-capture') {
        message = 'Microphone not found or not working.';
      } else if (event.error === 'not-allowed') {
        message = 'Microphone access denied.';
      }
      setError(message);
      hadError = true;
      setListening(false);
    };
    recognition.onend = () => {
      if (!isMounted.current) return;
      ended = true;
      isRecognitionRunning = false;
      setListening(false);
      if (!stopRequested.current && shouldListen && !hadError) {
        setTimeout(() => {
          if (isMounted.current && shouldListen && !isRecognitionRunning) {
            setListening(true);
            try {
              recognition.start();
            } catch {
              // ignore if already started
            }
          }
        }, 300);
      }
    };
    try {
      recognition.start();
      isRecognitionRunning = true;
    } catch {
      // ignore if already started
    }
    return () => {
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      recognition.onstart = null;
      if (!ended) recognition.abort();
      setListening(false);
    };
  }, [shouldListen]);

  // Start countdown after mic allowed
  useEffect(() => {
    if (micAllowed) setShowCountdown(true);
  }, [micAllowed]);

  // After countdown, start listening
  useEffect(() => {
    if (!showCountdown && micAllowed) {
      setShouldListen(true);
    }
  }, [showCountdown, micAllowed, current]);

  function handleRetry() {
    setError('');
    setUserAnswer('');
    setShouldListen(false);
    setTimeout(() => setShouldListen(true), 200);
  }

  function handleNext() {
    stopRequested.current = true;
    setShouldListen(false); // stop listening
    setListening(false);
    setError(''); // clear error on next
    recognitionRef.current?.abort();
    next(userAnswer);
    if (current + 1 >= questions.length) {
      router.push('/results');
    } else {
      setTimeout(() => {
        setUserAnswer('');
        setError('');
        setShouldListen(true); // start listening for next question
      }, 400);
    }
  }

  if (checkingMic) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-200 via-yellow-100 to-blue-200">
        <span className="text-2xl font-bold text-blue-600" aria-live="polite">Checking microphone permissions...</span>
      </div>
    );
  }

  if (!micAllowed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-200 via-yellow-100 to-blue-200">
        <span className="text-2xl font-bold text-red-600 mb-4" aria-live="assertive">Microphone access is required to play!</span>
        <button
          className="px-6 py-3 rounded-full bg-blue-500 text-white font-bold shadow-lg"
          onClick={() => window.location.reload()}
          aria-label="Retry microphone permission check"
        >
          Retry
        </button>
      </div>
    );
  }

  if (showCountdown) {
    return <Countdown onComplete={() => setShowCountdown(false)} />;
  }

  if (current >= questions.length) {
    return null;
  }

  const q = questions[current];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-200 via-yellow-100 to-blue-200 px-4">
      <div className="w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-bold text-gray-700">{current + 1} / {questions.length}</span>
          <span className="text-sm text-gray-500">Say the color of the text!</span>
        </div>
        <ColorCard word={COLOR_LABELS[q.word]} color={q.color} />
        <div className="mt-6 flex flex-col items-center">
          <div className="mb-2 text-lg">
            <span className="font-semibold text-gray-700">You said:</span>
            <span className="ml-2 text-blue-600 font-bold" aria-live="polite">{userAnswer || <span className="text-gray-400">(waiting...)</span>}</span>
          </div>
          {listening && (
            <div className="text-green-600 font-semibold mb-2" aria-live="polite">🎤 Listening...</div>
          )}
          {error && (
            <span className="text-red-500 mb-2 text-center w-full" aria-live="assertive">{error}</span>
          )}
          <div className="flex gap-4 w-full justify-center mt-2">
            <button
              className="px-8 py-3 rounded-full bg-green-500 text-white text-xl font-bold shadow-lg disabled:opacity-50"
              onClick={handleNext}
              disabled={!userAnswer}
              aria-label="Next color"
            >
              Next
            </button>
            {error && (
              <button
                className="px-6 py-3 rounded-full bg-blue-500 text-white font-semibold shadow hover:bg-blue-600"
                onClick={handleRetry}
                aria-label="Retry listening"
              >
                Retry
              </button>
            )}
          </div>
          {error && (
            <span className="text-xs text-gray-600 mt-2">Tip: Speak clearly and loudly into your mic.</span>
          )}
        </div>
      </div>
    </div>
  );
} 