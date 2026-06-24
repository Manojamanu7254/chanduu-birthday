import React, { useState, useEffect } from "react";
import { Sparkles, RefreshCw, Heart } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { synth } from "./AudioPlayer";

interface BirthdayCakeProps {
  herName: string;
  age: string;
  onAllBlownOut: () => void;
  triggerConfettiBurst: (x: number, y: number, type?: 'confetti' | 'hearts' | 'stars', count?: number) => void;
}

interface Candle {
  id: number;
  isLit: boolean;
  xOffset: number; // percentage horizontal shift
  yOffset: number; // vertical shift relative to cake top
  height: number;
  color: string;
}

export default function BirthdayCake({ herName, age, onAllBlownOut, triggerConfettiBurst }: BirthdayCakeProps) {
  const [candles, setCandles] = useState<Candle[]>([]);
  const [allBlown, setAllBlown] = useState(false);
  const [wishMade, setWishMade] = useState(false);

  // Initialize 5 colorful sweet candles
  const initCandles = () => {
    const candleColors = [
      "bg-rose-400", 
      "bg-amber-400", 
      "bg-teal-400", 
      "bg-violet-400", 
      "bg-pink-400"
    ];
    const newCandles = Array.from({ length: 5 }).map((_, i) => ({
      id: i + 1,
      isLit: true,
      xOffset: -40 + i * 20, // -40%, -20%, 0%, 20%, 40%
      yOffset: Math.abs(2 - i) * 3, // slightly arched arch
      height: 35 + (i % 2 === 0 ? 10 : 0), // alternating heights
      color: candleColors[i % candleColors.length]
    }));
    setCandles(newCandles);
    setAllBlown(false);
    setWishMade(false);
  };

  useEffect(() => {
    initCandles();
  }, [age]);

  const handleBlowCandle = (id: number, e: React.MouseEvent<HTMLDivElement>) => {
    const candle = candles.find(c => c.id === id);
    if (!candle || !candle.isLit) return;

    // Play synthesis blow sound & burst particles
    synth.playBlow();
    
    // Calculate client coords to burst particles on the canvas
    const rect = e.currentTarget.getBoundingClientRect();
    const px = rect.left + rect.width / 2;
    const py = rect.top;
    triggerConfettiBurst(px, py, 'stars');

    // Blow out candle
    const updated = candles.map(c => c.id === id ? { ...c, isLit: false } : c);
    setCandles(updated);

    // Check if all blown out
    const anyLit = updated.some(c => c.isLit);
    if (!anyLit) {
      setAllBlown(true);
      onAllBlownOut();
      // Massive splash of confetti!
      triggerConfettiBurst(window.innerWidth / 2, window.innerHeight * 0.4, 'hearts');
      triggerConfettiBurst(window.innerWidth / 2, window.innerHeight * 0.4, 'confetti');
      setTimeout(() => {
        triggerConfettiBurst(window.innerWidth / 4, window.innerHeight * 0.3, 'stars');
        triggerConfettiBurst(window.innerWidth * 3 / 4, window.innerHeight * 0.3, 'confetti');
      }, 300);
    }
  };

  const relightCandles = () => {
    initCandles();
    synth.playChime(440, 0.4); // A4
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center select-none" id="birthday-cake-container">
      <div className="mb-8">
        <h3 className="font-serif text-2xl md:text-3xl font-semibold text-rose-600 tracking-tight flex items-center justify-center gap-2">
          Make a Wish, {herName}! <Sparkles className="w-5 h-5 text-amber-500 animate-spin" />
        </h3>
        <p className="text-slate-500 text-sm mt-1 max-w-md">
          {allBlown 
            ? "Your candles are blown! Your beautiful wish is on its way... ✨" 
            : "Tap/Click on each glowing candle flame to blow them out and make a secret wish!"}
        </p>
      </div>

      {/* Interactive Birthday Cake Area */}
      <div className="relative w-64 h-72 flex flex-col items-center justify-end pb-4" id="cake-stage">
        
        {/* Glow behind candles */}
        <AnimatePresence>
          {!allBlown && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-40 w-52 h-24 bg-radial from-amber-200/50 via-rose-100/10 to-transparent blur-xl pointer-events-none"
            />
          )}
        </AnimatePresence>

        {/* Dynamic Candles Render */}
        <div className="absolute bottom-36 w-full flex justify-center z-10" id="candles-group">
          {candles.map((candle) => (
            <div
              key={candle.id}
              onClick={(e) => handleBlowCandle(candle.id, e)}
              className="absolute bottom-0 cursor-pointer group"
              style={{ 
                transform: `translateX(${candle.xOffset}px) translateY(${candle.yOffset}px)`
              }}
            >
              {/* Candle Body */}
              <div className={`w-3.5 rounded-t-sm relative transition-all duration-300 ${candle.color}`} style={{ height: `${candle.height}px` }}>
                {/* Spiral Detail */}
                <div className="absolute inset-0 bg-white/20 skew-y-12 pointer-events-none" />

                {/* Candle Wick */}
                <div className="absolute -top-2 left-[5px] w-[3px] h-2 bg-slate-600" />

                 {/* Candle Flame */}
                <AnimatePresence>
                  {candle.isLit && (
                    <>
                      {/* Cozy Shimmering Aura behind flame */}
                      <motion.div
                        animate={{ scale: [1, 1.25, 1], opacity: [0.15, 0.35, 0.15] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                        className="absolute -top-10 -left-4 w-12 h-12 bg-radial from-amber-300/40 to-transparent rounded-full blur-xs pointer-events-none"
                      />

                      {/* Rising Warm Embers/Sparkles from the Flame */}
                      <motion.div
                        animate={{ y: [-15, -50], x: [0, -8, 6, 0], opacity: [0, 0.9, 0], scale: [0.5, 0.9, 0.3] }}
                        transition={{ repeat: Infinity, duration: 1.8, ease: "easeOut", delay: candle.id * 0.2 }}
                        className="absolute left-1.5 -top-6 w-1.5 h-1.5 bg-amber-300 rounded-full blur-[0.5px] pointer-events-none"
                      />
                      <motion.div
                        animate={{ y: [-15, -65], x: [0, 6, -8, 0], opacity: [0, 0.8, 0], scale: [0.4, 0.7, 0.2] }}
                        transition={{ repeat: Infinity, duration: 2.4, ease: "easeOut", delay: candle.id * 0.3 + 0.4 }}
                        className="absolute left-1.5 -top-6 w-1 h-1 bg-rose-400/90 rounded-full blur-[0.5px] pointer-events-none"
                      />

                      {/* Actual Flame */}
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: [1, 1.12, 0.94, 1.06, 1], y: [0, -1, 0, -2, 0], rotate: [-2, 2, -1, 3, 0] }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ 
                          repeat: Infinity, 
                          duration: 1.4,
                          ease: "easeInOut"
                        }}
                        className="absolute -top-7 -left-[4px] w-5 h-6 cursor-pointer"
                      >
                        {/* Outer Flame (Yellow) */}
                        <div className="w-5 h-6 bg-amber-400 rounded-full rounded-b-xl opacity-90 blur-[0.5px] shadow-[0_0_12px_rgba(251,191,36,0.7)] flex items-end justify-center">
                          {/* Inner Flame (Orange/Red) */}
                          <div className="w-2.5 h-3.5 bg-orange-500 rounded-full rounded-b-xl opacity-95 mb-0.5" />
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>

                {/* Smoke Puff Effect (when blown out) */}
                <AnimatePresence>
                  {!candle.isLit && (
                    <motion.div
                      initial={{ opacity: 1, y: -10, scale: 0.5 }}
                      animate={{ opacity: 0, y: -30, scale: 1.5 }}
                      transition={{ duration: 0.8 }}
                      className="absolute -top-8 left-1 text-xs text-slate-400 pointer-events-none"
                    >
                      💨
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>

        {/* Cake Layers - Styled elegantly in pure Tailwind CSS */}
        <div className="relative w-56 flex flex-col items-center" id="cake-layers">
          
          {/* Cake Topper / Age Indicator */}
          <div className="absolute -top-7 bg-white/90 backdrop-blur-sm shadow-md border border-rose-100 text-rose-500 font-serif font-bold text-sm px-3 py-1 rounded-full z-20 flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" /> {age || "21"} <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
          </div>

          {/* Layer 1 (Top Layer) */}
          <div className="w-40 h-14 bg-rose-200 rounded-t-xl border-b-4 border-rose-300 relative shadow-inner z-10">
            {/* Top Frosting Drips */}
            <div className="absolute top-0 left-0 w-full flex justify-between px-1">
              {Array.from({ length: 8 }).map((_, i) => (
                <div 
                  key={i} 
                  className="w-4 bg-white rounded-b-full shadow-sm" 
                  style={{ height: `${8 + (i % 3) * 4}px` }} 
                />
              ))}
            </div>
            
            {/* Cake Icing Ring / Cream Stars */}
            <div className="absolute -bottom-1 left-0 w-full flex justify-around px-2 z-20">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="w-3 h-3 bg-white rounded-full shadow-inner animate-pulse" />
              ))}
            </div>
          </div>

          {/* Layer 2 (Middle Layer) */}
          <div className="w-48 h-14 bg-pink-100 border-b-4 border-pink-200 relative shadow-inner z-5">
            {/* Chocolate/Berry cream swirls */}
            <div className="absolute top-0 left-0 w-full h-2.5 bg-rose-400/80 flex items-center justify-around">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 bg-white rounded-full" />
              ))}
            </div>

            {/* Sprinkles on the side */}
            <div className="absolute inset-0 flex justify-around items-center px-4 pointer-events-none">
              <span className="w-1.5 h-3 bg-yellow-300 rounded-full rotate-45" />
              <span className="w-1.5 h-3 bg-rose-400 rounded-full -rotate-12" />
              <span className="w-1.5 h-3 bg-teal-300 rounded-full rotate-12" />
              <span className="w-1.5 h-3 bg-blue-300 rounded-full -rotate-45" />
            </div>
          </div>

          {/* Layer 3 (Base Layer) */}
          <div className="w-56 h-16 bg-rose-300 rounded-b-xl relative shadow-md">
            {/* Big Frosting Swags */}
            <div className="absolute top-0 left-0 w-full flex justify-between px-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div 
                  key={i} 
                  className="w-10 bg-pink-200 rounded-b-2xl shadow-sm border-b-2 border-pink-300" 
                  style={{ height: `${16 + (i % 2 === 0 ? 4 : 0)}px` }} 
                />
              ))}
            </div>

            {/* Decorative Strawberries on top of swags */}
            <div className="absolute -top-2 left-0 w-full flex justify-around px-4 z-10">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="w-4 h-5 bg-rose-500 rounded-full border border-rose-600 shadow-sm relative flex flex-col items-center">
                  <div className="w-2 h-1 bg-emerald-500 rounded-t-full absolute -top-1" />
                  {/* Seeds */}
                  <span className="w-0.5 h-0.5 bg-yellow-200 rounded-full absolute top-1.5 left-1" />
                  <span className="w-0.5 h-0.5 bg-yellow-200 rounded-full absolute top-2 right-1" />
                </div>
              ))}
            </div>

            {/* Elegant Cake Plate Stand */}
            <div className="absolute -bottom-3 -left-4 w-[256px] h-4 bg-slate-100 rounded-full border border-slate-200 shadow-md flex justify-center items-center z-[-1]">
              <div className="w-40 h-2 bg-slate-300 rounded-full opacity-60" />
            </div>
          </div>

        </div>
      </div>

      {/* Relight Controls / Blow Confirmation Message */}
      <div className="mt-8">
        <AnimatePresence mode="wait">
          {allBlown ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="bg-rose-50 border border-rose-100 px-6 py-4 rounded-2xl max-w-sm shadow-md">
                <p className="text-rose-600 font-serif font-semibold text-lg flex items-center justify-center gap-1.5 animate-bounce">
                  ✨ Best Wish Made! ✨
                </p>
                <p className="text-slate-600 text-xs mt-1">
                  May your year be as marvelous, joyful, and radiant as you are, {herName}!
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={relightCandles}
                  className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-600 hover:text-rose-500 font-medium text-xs px-4 py-2 border border-slate-200 hover:border-rose-100 rounded-full shadow-sm transition-all cursor-pointer"
                  id="relight-btn"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Light Again
                </button>
                <button
                  onClick={() => {
                    setWishMade(true);
                    triggerConfettiBurst(window.innerWidth / 2, window.innerHeight * 0.4, 'stars', 50);
                    synth.playChime(523.25, 0.6);
                  }}
                  disabled={wishMade}
                  className={`flex items-center gap-2 font-semibold text-xs px-5 py-2.5 rounded-full shadow-sm transition-all cursor-pointer ${
                    wishMade 
                      ? "bg-slate-100 text-slate-400 cursor-default" 
                      : "bg-rose-500 hover:bg-rose-600 text-white hover:scale-105"
                  }`}
                  id="send-wish-btn"
                >
                  {wishMade ? "❤️ Wish Sent to Universe!" : "🪄 Send Wish to Universe!"}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-rose-400 font-serif italic animate-pulse"
            >
              💖 A special year deserves special wishes 💖
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
