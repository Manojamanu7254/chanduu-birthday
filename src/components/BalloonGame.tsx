import React, { useState, useEffect } from "react";
import { Sparkles, Gift, Heart, Eye } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { synth } from "./AudioPlayer";
import { BalloonMessage } from "../types";

interface BalloonGameProps {
  balloons: BalloonMessage[];
  triggerConfettiBurst: (x: number, y: number, type?: 'confetti' | 'hearts' | 'stars', count?: number) => void;
}

interface BalloonState {
  id: string;
  color: string;
  message: string;
  isPopped: boolean;
  xPos: number; // percentage horizontal position
  delay: number; // speed delay
  floatDuration: number; // animation timing
}

export default function BalloonGame({ balloons, triggerConfettiBurst }: BalloonGameProps) {
  const [activeBalloons, setActiveBalloons] = useState<BalloonState[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);

  const initBalloons = () => {
    const states = balloons.map((b, idx) => ({
      ...b,
      isPopped: false,
      // Distribute them evenly but add some natural randomness
      xPos: 10 + (idx * 15) + (Math.random() * 8),
      delay: idx * 0.3,
      floatDuration: 12 + Math.random() * 6 // Float up timing
    }));
    setActiveBalloons(states);
    setSelectedMessage(null);
  };

  useEffect(() => {
    initBalloons();
  }, [balloons]);

  const handlePop = (id: string, e: React.MouseEvent<HTMLDivElement>) => {
    const target = activeBalloons.find((b) => b.id === id);
    if (!target || target.isPopped) return;

    // Pop Sound & Confetti
    synth.playPop();
    const rect = e.currentTarget.getBoundingClientRect();
    const px = rect.left + rect.width / 2;
    const py = rect.top + rect.height / 2;
    
    triggerConfettiBurst(px, py, 'confetti', 35);
    triggerConfettiBurst(px, py, 'hearts', 15);

    // Update state
    setActiveBalloons((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isPopped: true } : b))
    );

    // Open Sweet message box
    setSelectedMessage(target.message);
  };

  const remainingCount = activeBalloons.filter((b) => !b.isPopped).length;

  return (
    <div className="flex flex-col items-center w-full px-4 py-8 relative" id="balloon-game-container">
      <div className="mb-8 text-center">
        <h3 className="font-serif text-2xl md:text-3xl font-semibold text-rose-600 tracking-tight flex items-center justify-center gap-2">
          Pop a Balloon Surprise! <Gift className="w-5 h-5 text-amber-500 animate-pulse" />
        </h3>
        <p className="text-slate-500 text-sm mt-1 max-w-md mx-auto">
          {remainingCount === 0 
            ? "Aww! You popped all of them! Beautiful messages are revealed below." 
            : `Click on the floating balloons to pop them and unlock hidden birthday notes (${remainingCount} left!)`}
        </p>
      </div>

      {/* Floating Sky Frame */}
      <div className="relative w-full max-w-2xl h-96 bg-gradient-to-b from-sky-50/50 to-rose-50/20 rounded-3xl border border-rose-100/50 p-6 overflow-hidden shadow-inner flex justify-center" id="balloon-sky">
        
        {/* Background Clouds or floating circles */}
        <div className="absolute top-10 left-10 w-24 h-8 bg-white/70 rounded-full blur-sm pointer-events-none" />
        <div className="absolute top-24 right-12 w-32 h-10 bg-white/70 rounded-full blur-sm pointer-events-none" />
        <div className="absolute bottom-16 left-1/4 w-28 h-9 bg-white/60 rounded-full blur-sm pointer-events-none" />

        {/* Floating Helium Balloons */}
        <div className="absolute inset-x-0 bottom-0 h-full w-full">
          {activeBalloons.map((b) => (
            <AnimatePresence key={b.id}>
              {!b.isPopped && (
                <motion.div
                  initial={{ y: "110%" }}
                  animate={{ 
                    y: "-120%",
                    x: [0, 15, -15, 0] // subtle swaying
                  }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{
                    y: {
                      duration: b.floatDuration,
                      repeat: Infinity,
                      ease: "linear",
                      delay: b.delay
                    },
                    x: {
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }
                  }}
                  className="absolute cursor-pointer select-none group"
                  style={{ left: `${b.xPos}%` }}
                  onClick={(e) => handlePop(b.id, e)}
                >
                  <div className="relative flex flex-col items-center">
                    
                    {/* Balloon Bubble */}
                    <div className={`w-14 h-18 bg-gradient-to-br ${b.color} rounded-full shadow-md flex items-center justify-center relative transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg`}>
                      
                      {/* Heart Silhouette */}
                      <Heart className="w-5 h-5 text-white/40 fill-white/20" />

                      {/* Glossy shine reflection overlay */}
                      <div className="absolute top-2.5 left-3 w-3 h-4 bg-white/30 rounded-full rotate-12 blur-[0.5px]" />
                      
                      {/* Balloon Valve (Small triangle at bottom) */}
                      <div className="absolute -bottom-1 left-[23px] w-0 h-0 border-l-[5px] border-r-[5px] border-b-[6px] border-b-rose-400 rotate-180" />
                    </div>

                    {/* Dangling Balloon String */}
                    <svg className="w-4 h-16 text-slate-300 pointer-events-none" viewBox="0 0 20 60">
                      <path 
                        d="M 10 0 Q 15 15, 5 30 T 10 60" 
                        fill="transparent" 
                        stroke="currentColor" 
                        strokeWidth="1.5" 
                      />
                    </svg>

                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          ))}
        </div>

        {/* If all popped, display clean center panel */}
        {remainingCount === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 m-auto w-72 h-44 bg-white/95 backdrop-blur-md rounded-2xl border border-rose-100 p-6 shadow-xl flex flex-col items-center justify-center gap-3 text-center z-10"
          >
            <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 shadow-inner">
              <Heart className="w-6 h-6 fill-rose-500 text-rose-500 animate-pulse" />
            </div>
            <div>
              <p className="font-serif font-semibold text-rose-600 text-sm">All Balloons Popped!</p>
              <p className="text-slate-500 text-xs mt-1">You popped every single wish. Click below to inflate them again!</p>
            </div>
            <button
              onClick={initBalloons}
              className="mt-1 bg-rose-500 hover:bg-rose-600 text-white font-medium text-xs px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              Inflate Balloons 🎈
            </button>
          </motion.div>
        )}
      </div>

      {/* Sweet Surprises Display Card */}
      <div className="mt-8 w-full max-w-xl min-h-[140px] flex items-center justify-center relative">
        <AnimatePresence mode="wait">
          {selectedMessage ? (
            <motion.div
              key={selectedMessage}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="bg-white border-2 border-dashed border-rose-200 p-6 rounded-3xl shadow-md w-full text-center relative overflow-hidden"
              id="balloon-message-card"
            >
              {/* Cute corner decorations */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-rose-300 rounded-tl-xl m-1" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-rose-300 rounded-tr-xl m-1" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-rose-300 rounded-bl-xl m-1" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-rose-300 rounded-br-xl m-1" />

              <span className="text-2xl mb-1 block">🎈</span>
              <p className="font-serif text-slate-700 italic text-base md:text-lg leading-relaxed px-4">
                "{selectedMessage}"
              </p>
              
              <div className="mt-4 flex justify-center gap-1.5 items-center">
                <span className="h-[1px] w-8 bg-rose-200" />
                <span className="text-[10px] uppercase font-bold tracking-wider text-rose-400 flex items-center gap-1">
                  Popped Surprises <Sparkles className="w-3 h-3 text-amber-400" />
                </span>
                <span className="h-[1px] w-8 bg-rose-200" />
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              className="text-slate-400 font-serif italic text-xs text-center border border-dashed border-slate-200/60 p-6 rounded-3xl w-full"
            >
              💖 Pop any floating balloon to read a secret love note or sweet message! 💖
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* History of Popped Messages so she can re-read them if she wants */}
      <div className="mt-6 w-full max-w-xl" id="revealed-notes-history">
        {activeBalloons.some((b) => b.isPopped) && (
          <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-4 border border-rose-100/40">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" /> Revealed Notes
            </h4>
            <div className="flex flex-wrap gap-2">
              {activeBalloons
                .filter((b) => b.isPopped)
                .map((b) => (
                  <button
                    key={b.id}
                    onClick={() => {
                      setSelectedMessage(b.message);
                      synth.playChime(392, 0.2); // G4 chime
                    }}
                    className={`text-xs px-3 py-1.5 rounded-full border bg-white/90 hover:bg-rose-50 hover:border-rose-200 shadow-sm transition-all cursor-pointer text-slate-600 flex items-center gap-1 ${
                      selectedMessage === b.message ? "border-rose-400 ring-2 ring-rose-100 text-rose-600 font-medium" : "border-slate-100"
                    }`}
                  >
                    <span className="text-sm">🎈</span> {b.message.substring(0, 16)}...
                  </button>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
