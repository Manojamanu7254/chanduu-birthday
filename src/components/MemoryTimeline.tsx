import React, { useState } from "react";
import { Sparkles, Calendar, Heart, Camera, RotateCw } from "lucide-react";
import { motion } from "motion/react";
import { Memory } from "../types";
import { synth } from "./AudioPlayer";

interface MemoryTimelineProps {
  memories: Memory[];
  herName: string;
}

export default function MemoryTimeline({ memories, herName }: MemoryTimelineProps) {
  // Store set of flipped memory card IDs
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  const toggleCardFlip = (id: string) => {
    setFlippedCards(prev => {
      const isCurrentlyFlipped = !prev[id];
      // Play a cute soft paper-flipping pitch chime
      if (isCurrentlyFlipped) {
        synth.playChime(349.23, 0.25); // F4
        setTimeout(() => synth.playChime(440.00, 0.25), 80); // A4 (rising chord)
      } else {
        synth.playChime(440.00, 0.25); // A4
        setTimeout(() => synth.playChime(349.23, 0.25), 80); // F4 (falling chord)
      }
      return { ...prev, [id]: isCurrentlyFlipped };
    });
  };

  return (
    <div className="flex flex-col items-center w-full px-4 py-12 relative" id="memory-timeline-container">
      {/* Decorative floating shapes in background */}
      <div className="absolute top-1/4 right-[8%] w-24 h-24 bg-rose-100/40 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-[5%] w-32 h-32 bg-amber-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="mb-14 text-center relative z-10">
        <span className="text-[10px] font-bold uppercase tracking-widest text-rose-500 bg-rose-50 px-4 py-1.5 rounded-full border border-rose-100/70 shadow-sm inline-flex items-center gap-1.5">
          Our Special Journey <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
        </span>
        <h3 className="font-serif text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight mt-3">
          Memory Lane for {herName}
        </h3>
        <p className="text-slate-500 text-xs md:text-sm mt-2 max-w-lg mx-auto leading-relaxed">
          Every single second spent with you has been a beautiful chapter. <span className="font-semibold text-rose-500">Tap a Polaroid photo</span> below to flip it over and read the special note inside!
        </p>
      </div>

      {/* Vertical Timeline container */}
      <div className="relative w-full max-w-3xl px-2" id="vertical-timeline">
        {/* Continuous center vertical dashed line */}
        <div className="absolute left-6 md:left-1/2 top-4 bottom-4 w-[2px] bg-dashed bg-rose-200 -translate-x-1/2 pointer-events-none z-0" />

        {/* Timeline items mapped */}
        <div className="space-y-16">
          {memories.map((memory, index) => {
            const isEven = index % 2 === 0;
            const isFlipped = !!flippedCards[memory.id];

            return (
              <div
                key={memory.id}
                className={`flex flex-col md:flex-row items-start md:items-center relative z-10 ${
                  isEven ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Visual Timeline Node in the middle */}
                <div 
                  onClick={() => toggleCardFlip(memory.id)}
                  className="absolute left-6 md:left-1/2 w-10 h-10 rounded-full bg-white border-2 border-rose-300 shadow-lg flex items-center justify-center -translate-x-1/2 z-20 cursor-pointer transition-all duration-300 hover:scale-115 hover:border-rose-500 active:scale-90"
                >
                  <span className="text-base select-none">{memory.emoji || "✨"}</span>
                </div>

                {/* Left empty spacer for desktop symmetry */}
                <div className="hidden md:block md:w-1/2" />

                {/* Actual Content Card (Polaroid with 3D Flip) */}
                <div className="w-full md:w-1/2 pl-14 md:pl-0 md:px-10">
                  
                  {/* Perspective wrapper */}
                  <div className="[perspective:1000px] w-full min-h-[340px] relative">
                    
                    {/* Flippable Container */}
                    <div
                      onClick={() => toggleCardFlip(memory.id)}
                      className={`relative w-full h-[340px] cursor-pointer transition-transform duration-700 [transform-style:preserve-3d] ${
                        isFlipped ? "[transform:rotateY(180deg)]" : ""
                      }`}
                    >
                      
                      {/* === FRONT FACE (Polaroid Photo) === */}
                      <div className="absolute inset-0 w-full h-full bg-white rounded-2xl p-4 shadow-md border border-slate-100 flex flex-col justify-between [backface-visibility:hidden] select-none hover:shadow-xl transition-shadow">
                        
                        {/* Washi adhesive tape graphic at the top */}
                        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-24 h-7 bg-amber-100/70 hover:bg-amber-100 border-b border-dashed border-amber-200/50 backdrop-blur-xs rotate-[-1deg] shadow-xs flex items-center justify-center text-[8px] uppercase tracking-wider text-amber-600/80 font-bold font-mono">
                          ♥ MEMORY #{index + 1}
                        </div>

                        {/* Top square "photo" canvas */}
                        <div className="w-full aspect-square bg-gradient-to-tr from-rose-50 via-pink-100/50 to-amber-50/40 rounded-lg relative overflow-hidden flex items-center justify-center border border-slate-50 mt-2">
                          {/* Radial overlay */}
                          <div className="absolute inset-0 bg-radial from-transparent to-white/20 pointer-events-none" />
                          
                          {/* Animated vector layout */}
                          <motion.div 
                            animate={{ scale: [0.95, 1.05, 0.95] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="text-center"
                          >
                            <span className="text-5xl select-none filter drop-shadow-md inline-block">
                              {memory.emoji || "📸"}
                            </span>
                          </motion.div>

                          {/* Soft Camera Watermark */}
                          <div className="absolute bottom-2 right-2 bg-white/70 backdrop-blur-xs p-1 rounded-md text-[9px] font-bold text-slate-500 uppercase flex items-center gap-1">
                            <Camera className="w-3 h-3" /> SNAP
                          </div>
                        </div>

                        {/* Bottom Polaroid caption area with handwritten styling */}
                        <div className="pt-4 pb-2 text-center border-t border-slate-100/80">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center justify-center gap-1.5 mb-1">
                            <Calendar className="w-3.5 h-3.5 text-rose-400" /> {memory.date}
                          </span>
                          <h4 className="font-serif text-lg font-bold text-slate-800 leading-tight">
                            {memory.title}
                          </h4>
                          
                          {/* Cute flip guidance */}
                          <div className="mt-1 flex items-center justify-center gap-1 text-[9px] text-rose-500 font-bold uppercase tracking-wider animate-pulse">
                            <RotateCw className="w-3 h-3 animate-spin-slow" /> Tap to flip card
                          </div>
                        </div>
                      </div>

                      {/* === BACK FACE (Diary / Sweet Message) === */}
                      <div className="absolute inset-0 w-full h-full bg-[#FCFBF8] rounded-2xl p-6 shadow-md border border-amber-100 flex flex-col justify-between [backface-visibility:hidden] [transform:rotateY(180deg)] select-none">
                        
                        {/* Washi tape back view */}
                        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-24 h-7 bg-amber-50/80 border-b border-amber-100 pointer-events-none rotate-[1deg]" />

                        <div className="space-y-4">
                          <div className="flex items-center justify-between border-b border-amber-100 pb-2">
                            <span className="font-cursive text-rose-500 text-xl font-bold">Diary Page</span>
                            <Heart className="w-4 h-4 fill-rose-500 text-rose-500 animate-pulse" />
                          </div>

                          <div className="pt-2">
                            {/* Hand-written cursive message */}
                          className="font-cursive text-slate-700 text-base md:text-lg leading-normal text-left whitespace-pre-wrap"
                            </p>
                          </div>
                        </div>

                        {/* Back-face signature / tap-back */}
                        <div className="pt-3 border-t border-amber-100/60 flex items-center justify-between text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                          <span>Story continues...</span>
                          <div className="flex items-center gap-1 text-rose-500">
                            <span>Flip back</span> <RotateCw className="w-3 h-3 animate-spin-slow" />
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

