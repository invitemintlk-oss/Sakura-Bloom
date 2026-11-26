import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WEDDING } from '../config/wedding';

interface IntroVideoProps {
  onComplete: () => void;
  onMusicStart?: () => void;
  readyToTransition?: boolean;
}

export function IntroVideo({ onComplete, onMusicStart, readyToTransition = true }: IntroVideoProps) {
  const [exiting, setExiting] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayVideo = () => {
    if (!readyToTransition) return;
    setIsPlaying(true);
    if (onMusicStart) onMusicStart(); // Start background music immediately
    if (videoRef.current) {
      videoRef.current.play().catch(e => console.error('Video play failed', e));
    }
  };

  const handleVideoEnd = () => {
    setExiting(true);
    setTimeout(() => {
      onComplete();
    }, 500); // Allow time for exit animation
  };

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-black overflow-hidden"
      initial={{ opacity: 1 }}
      animate={{ opacity: exiting ? 0 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Video sits underneath and only becomes visible once playing */}
      <video
        ref={videoRef}
        src={WEDDING.introVideo}
        poster={WEDDING.introImage}
        playsInline
        muted
        preload="auto"
        onEnded={handleVideoEnd}
        className="absolute inset-0 w-full h-full object-cover"
      />

      <AnimatePresence>
        {!isPlaying && (
          <motion.div
            key="cover"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 z-10 flex flex-col justify-between"
          >
            {/* First view: still image */}
            <img
              src={WEDDING.introImage}
              alt="Wedding invitation"
              fetchPriority="high"
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Soft shading so the text stays readable on the light photo */}
            <div className="absolute inset-x-0 top-0 h-48 sm:h-64 bg-gradient-to-b from-black/55 to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-56 sm:h-72 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

            {/* Top: title */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="relative z-10 w-full pt-[max(3.5rem,env(safe-area-inset-top))] sm:pt-20 text-center px-4"
            >
              <h1 className="text-3xl sm:text-5xl font-serif text-white tracking-[0.15em] drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
                The Wedding Invitation
              </h1>
            </motion.div>

            {/* Bottom: button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative z-10 w-full flex justify-center px-4 pb-[max(3.5rem,env(safe-area-inset-bottom))] sm:pb-20"
            >
              <button
                onClick={handlePlayVideo}
                disabled={!readyToTransition}
                className="px-10 py-4 rounded-full bg-white/15 backdrop-blur-lg border border-white/40 text-white font-sans uppercase tracking-[0.3em] text-sm hover:bg-white/25 transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.3)] active:scale-95 disabled:opacity-50"
              >
                {readyToTransition ? 'View Invitation' : 'Loading...'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skip button while the video plays */}
      <AnimatePresence>
        {isPlaying && (
          <motion.button
            key="skip"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 3, duration: 1 }}
            onClick={handleVideoEnd}
            className="absolute bottom-10 right-10 z-20 text-white/50 text-xs tracking-widest uppercase hover:text-white transition-colors"
          >
            Skip Intro
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
