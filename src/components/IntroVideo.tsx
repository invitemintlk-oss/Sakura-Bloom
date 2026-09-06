import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

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
      videoRef.current.playbackRate = 1.75; // Increased playback speed
      videoRef.current.play().catch(e => console.error("Video play failed", e));
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
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black overflow-hidden"
      initial={{ opacity: 1 }}
      animate={{ opacity: exiting ? 0 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <video
        ref={videoRef}
        src="/Wedding_invitation_intro_video_202609061611.mp4"
        playsInline
        muted
        onEnded={handleVideoEnd}
        className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${
          isPlaying ? 'opacity-100 blur-none' : 'opacity-50 blur-xl scale-105'
        }`}
      />
      
      <AnimatePresence>
        {!isPlaying && (
          <>
            {/* Top Text */}
            <motion.div 
              key="text"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8 }}
              className="absolute top-0 left-0 z-10 w-full pt-20 sm:pt-28 text-center px-4"
            >
              <h1 className="text-4xl sm:text-5xl font-serif text-white tracking-widest drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
                The Wedding Invitation
              </h1>
            </motion.div>

            {/* Middle Blurred Button */}
            <motion.div 
              key="button"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative z-10 w-full flex justify-center"
            >
              <button
                onClick={handlePlayVideo}
                disabled={!readyToTransition}
                className="px-10 py-4 rounded-full bg-white/10 backdrop-blur-lg border border-white/30 text-white font-sans uppercase tracking-[0.3em] text-sm hover:bg-white/20 transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.3)] active:scale-95 disabled:opacity-50"
              >
                {readyToTransition ? 'View Invitation' : 'Loading...'}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Skip Button (Optional, just in case video is too long or stuck) */}
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
