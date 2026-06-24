import React, { useState } from "react";
import { Mail, ArrowRight, Heart, Sparkles, Star } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { synth } from "./AudioPlayer";

interface EnvelopeCardProps {
  herName: string;
  relation: string;
  onOpen: () => void;
}

export default function EnvelopeCard({ herName, relation, onOpen }: EnvelopeCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullyOpened, setIsFullyOpened] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  const handleOpenEnvelope = () => {
    if (isOpen) return;
    setIsOpen(true);
    // Play dual melodic chime chord
    synth.playChime(392.00, 0.4); // G4
    setTimeout(() => {
      synth.playChime(523.25, 0.6); // C5
      synth.playChime(659.25, 0.5); // E5 (Major Triad Sparkle)
    }, 120);
  };

  const handleProceed = () => {
    setIsFullyOpened(true);
    // Smooth fade out
    setTimeout(() => {
      onOpen();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-[5000] flex items-center justify-center bg-radial from-rose-50/70 via-pink-100/40 to-amber-50/20 overflow-hidden px-4 select-none" id="envelope-screen">
      
      {/* Background radial soft light blur */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-rose-100/40 via-transparent to-transparent pointer-events-none" />
      
      {/* Delicate floating ambient sparkles in background */}
      <div className="absolute top-[12%] left-[15%] text-rose-300 animate-bounce text-2xl opacity-70">🌸</div>
      <div className="absolute top-[25%] right-[20%] text-pink-400 animate-pulse text-xl opacity-60">✨</div>
      <div className="absolute bottom-[22%] left-[18%] text-purple-300 animate-pulse text-2xl opacity-70">💖</div>
      <div className="absolute bottom-[16%] right-[15%] text-amber-300 animate-bounce text-xl opacity-60">⭐</div>

      <AnimatePresence>
        {!isFullyOpened && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0, y: -80, filter: "blur(10px)" }}
            transition={{ type: "spring", damping: 25, stiffness: 100 }}
            className="flex flex-col items-center w-full max-w-lg"
          >
            {/* Elegant Header Title */}
            <div className="mb-10 text-center">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-1.5 bg-rose-50/90 text-rose-500 font-bold text-[10px] uppercase tracking-widest px-3.5 py-1.5 rounded-full border border-rose-100/60 shadow-xs mb-3"
              >
                <Star className="w-3.5 h-3.5 fill-rose-500 animate-spin-slow" /> A Magical Surprise is Waiting
              </motion.div>
              
              <motion.h2 
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="font-serif text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight"
              >
                Just For You...
              </motion.h2>
              <p className="text-slate-400 font-sans text-xs mt-2 uppercase tracking-widest font-semibold">
                Beautifully crafted for {herName}
              </p>
            </div>

            {/* 3D-tilt Responsive Card Wrapper */}
            <div className="[perspective:1000px] w-full max-w-sm h-64 relative">
              <motion.div 
                onClick={handleOpenEnvelope}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                animate={{ 
                  rotateY: isOpen ? 0 : mousePos.x * 18, 
                  rotateX: isOpen ? 0 : -mousePos.y * 18,
                  y: [0, -6, 0] 
                }}
                transition={{
                  y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                  rotateX: { type: "spring", damping: 15 },
                  rotateY: { type: "spring", damping: 15 }
                }}
                className={`w-full h-full bg-white rounded-3xl border border-rose-100/80 shadow-2xl transition-all duration-300 flex flex-col items-center justify-center cursor-pointer overflow-hidden relative ${
                  isOpen ? "ring-2 ring-rose-300" : "hover:border-rose-200/80 hover:shadow-rose-100/50"
                }`}
                style={{ transformStyle: "preserve-3d" }}
                id="interactive-envelope"
              >
                {/* Back decorative lining inside envelope */}
                <div className="absolute inset-0 bg-gradient-to-br from-rose-50/40 via-white to-pink-50/20 pointer-events-none" />

                {/* Classic styled triangular flap details */}
                <div className={`absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-rose-100/50 via-white/10 to-transparent origin-bottom transition-all duration-700 z-10 pointer-events-none ${
                  isOpen ? "opacity-30 scale-y-110" : ""
                }`} />

                <AnimatePresence mode="wait">
                  {!isOpen ? (
                    /* Sealed Envelope View */
                    <motion.div 
                      key="sealed"
                      exit={{ opacity: 0, scale: 0.9, filter: "blur(5px)" }}
                      className="flex flex-col items-center justify-center p-6 text-center z-20"
                      style={{ transform: "translateZ(30px)" }}
                    >
                      {/* Interactive 3D wax seal button */}
                      <div className="relative w-20 h-20 bg-rose-500 rounded-full flex items-center justify-center border-4 border-rose-200 shadow-xl hover:scale-105 active:scale-95 transition-transform cursor-pointer" id="wax-seal">
                        {/* Radial double ring wave */}
                        <span className="absolute inset-0 rounded-full border-2 border-rose-400 animate-ping opacity-60" />
                        <span className="absolute inset-2 rounded-full border border-rose-300 animate-pulse" />
                        
                        <Heart className="w-8 h-8 text-white fill-white animate-pulse" />
                      </div>

                      <p className="text-rose-500 font-serif font-semibold text-sm mt-5 animate-pulse flex items-center gap-1.5">
                        <Mail className="w-4.5 h-4.5 text-rose-500" /> Tap Wax Seal to Break & Open 💌
                      </p>
                      
                      <span className="text-[10px] text-slate-400 font-sans font-bold tracking-widest uppercase mt-2.5 block bg-slate-50 border border-slate-100 px-3 py-1 rounded-full">
                        To: {herName} ({relation})
                      </span>
                    </motion.div>
                  ) : (
                    /* Elegant Letter Pull-Out Animation */
                    <motion.div
                      key="opened"
                      initial={{ opacity: 0, y: 70, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: 0.25, type: "spring", stiffness: 120, damping: 14 }}
                      className="absolute inset-0 bg-white/95 p-6 rounded-3xl flex flex-col items-center justify-between text-center z-30"
                      id="opened-card-slide"
                    >
                      <div className="flex flex-col items-center pt-2">
                        <div className="w-11 h-11 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 shadow-inner mb-2 animate-bounce">
                          <Sparkles className="w-5 h-5 text-rose-500 fill-rose-100" />
                        </div>
                        
                        <span className="text-[9px] font-extrabold uppercase tracking-widest text-amber-500">
                          Happy Birthday!
                        </span>
                        
                        <h3 className="font-serif text-xl font-bold text-rose-600 mt-1">
                          Welcome to Your Space, {herName}
                        </h3>
                        
                        <p className="text-slate-500 text-xs mt-2 leading-relaxed px-4 max-w-xs font-sans">
                          I built this interactive, musical surprise book just for you. Ready to step inside your world of melodies?
                        </p>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Stop parent bubble triggers
                          handleProceed();
                        }}
                        className="bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs px-7 py-3 rounded-full shadow-lg hover:shadow-rose-100/50 transition-all duration-300 flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95 mb-1"
                        id="step-inside-btn"
                      >
                        Step Inside <ArrowRight className="w-4 h-4 animate-pulse" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
            
            {/* Under-card text */}
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-6 bg-white/50 border border-slate-100 px-3 py-1 rounded-full">
              Made with Love, Just for Chanduu ❤️ — By Manu
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

