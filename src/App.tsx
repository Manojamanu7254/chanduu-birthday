import React, { useState, useEffect, useRef } from "react";
import { Sparkles, Heart, Gift, Music, ChevronDown, Award } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { BirthdayConfig, DEFAULT_CONFIG } from "./types";
import { ConfettiEffect, ConfettiRef } from "./components/ConfettiEffect";
import AudioPlayer, { synth } from "./components/AudioPlayer";
import EnvelopeCard from "./components/EnvelopeCard";
import BirthdayCake from "./components/BirthdayCake";
import BalloonGame from "./components/BalloonGame";
import MemoryTimeline from "./components/MemoryTimeline";
import Customizer from "./components/Customizer";

const THEME_CLASSES = {
  rose: {
    bgGradient: "from-rose-50/40 via-white to-pink-50/20",
    textPrimary: "text-rose-600",
    textDark: "text-rose-800",
    bgAccent: "bg-rose-500",
    bgHover: "hover:bg-rose-600",
    borderAccent: "border-rose-100",
    bgLight: "bg-rose-50",
    textLight: "text-rose-400"
  },
  amber: {
    bgGradient: "from-amber-50/30 via-white to-orange-50/20",
    textPrimary: "text-amber-600",
    textDark: "text-amber-800",
    bgAccent: "bg-amber-500",
    bgHover: "hover:bg-amber-600",
    borderAccent: "border-amber-100",
    bgLight: "bg-amber-50",
    textLight: "text-amber-400"
  },
  lavender: {
    bgGradient: "from-purple-50/30 via-white to-indigo-50/20",
    textPrimary: "text-purple-600",
    textDark: "text-purple-800",
    bgAccent: "bg-purple-500",
    bgHover: "hover:bg-purple-600",
    borderAccent: "border-purple-100",
    bgLight: "bg-purple-50",
    textLight: "text-purple-400"
  },
  teal: {
    bgGradient: "from-teal-50/30 via-white to-emerald-50/20",
    textPrimary: "text-teal-600",
    textDark: "text-teal-800",
    bgAccent: "bg-teal-500",
    bgHover: "hover:bg-teal-600",
    borderAccent: "border-teal-100",
    bgLight: "bg-teal-50",
    textLight: "text-teal-400"
  },
  ruby: {
    bgGradient: "from-red-50/30 via-white to-rose-50/20",
    textPrimary: "text-red-600",
    textDark: "text-red-800",
    bgAccent: "bg-red-500",
    bgHover: "hover:bg-red-600",
    borderAccent: "border-red-100",
    bgLight: "bg-red-50",
    textLight: "text-red-400"
  }
};

interface HeartParticle {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
}

export default function App() {
  const [config, setConfig] = useState<BirthdayConfig>(DEFAULT_CONFIG);
  const [isEnvelopeOpened, setIsEnvelopeOpened] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState<HeartParticle[]>([]);

  const confettiRef = useRef<ConfettiRef | null>(null);

  // Load configuration from local storage on load
  useEffect(() => {
    try {
      const stored = localStorage.getItem("birthday_surprise_config");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.herName === "Sneha") {
          // Clean up older default template cache
          localStorage.removeItem("birthday_surprise_config");
        } else {
          setConfig(parsed);
        }
      }
    } catch (e) {
      console.error("Failed to read birthday config from local storage", e);
    }

    // Generate random background floating hearts
    const hearts: HeartParticle[] = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // percentage horizontal placement
      size: Math.random() * 15 + 8, // size in pixels
      duration: Math.random() * 8 + 6, // speed duration in seconds
      delay: Math.random() * 5 // start delay
    }));
    setFloatingHearts(hearts);
  }, []);

  // Update page tab title to custom config
  useEffect(() => {
    document.title = config.pageTitle || "Happy Birthday!";
  }, [config.pageTitle]);

  const handleSaveConfig = (newConfig: BirthdayConfig) => {
    setConfig(newConfig);
    try {
      localStorage.setItem("birthday_surprise_config", JSON.stringify(newConfig));
    } catch (e) {
      console.error("Failed to save config", e);
    }
  };

  const handleResetConfig = () => {
    setConfig(DEFAULT_CONFIG);
    try {
      localStorage.removeItem("birthday_surprise_config");
    } catch (e) {
      console.error("Failed to reset config", e);
    }
  };

  const handleAllCandlesBlownOut = () => {
    // Rain down beautiful continuous confetti particles
    if (confettiRef.current) {
      confettiRef.current.triggerRain(5000);
    }
  };

  const triggerConfettiBurst = (x: number, y: number, type?: 'confetti' | 'hearts' | 'stars', count?: number) => {
    if (confettiRef.current) {
      confettiRef.current.triggerBurst(x, y, type, count);
    }
  };

  const handlePageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Avoid triggering sparkles when active controls or customization sliders are clicked
    const target = e.target as HTMLElement;
    if (
      target.closest("button") ||
      target.closest("input") ||
      target.closest("textarea") ||
      target.closest("select") ||
      target.closest("#customizer-panel") ||
      target.closest("#music-box") ||
      target.closest("#customizer-launcher") ||
      target.closest(".wax-seal")
    ) {
      return;
    }

    // Spawn 8 lovely micro hearts, stars, or confetti at mouse pointer
    const types: ("confetti" | "hearts" | "stars")[] = ["hearts", "stars", "confetti"];
    const chosenType = types[Math.floor(Math.random() * types.length)];
    triggerConfettiBurst(e.clientX, e.clientY, chosenType, 8);
  };

  const theme = THEME_CLASSES[config.themeColor] || THEME_CLASSES.rose;

  return (
    <div 
      onClick={handlePageClick}
      className={`min-h-screen bg-gradient-to-b ${theme.bgGradient} font-sans relative overflow-x-hidden pb-20 cursor-default`} 
      id="app-root"
    >
      {/* Background Floating Hearts */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden" id="ambient-hearts">
        {floatingHearts.map((h) => (
          <motion.div
            key={h.id}
            initial={{ y: "110vh", opacity: 0, x: `${h.x}vw` }}
            animate={{ 
              y: "-10vh", 
              opacity: [0, 0.4, 0.4, 0],
              x: [`${h.x}vw`, `${h.x + (Math.random() * 6 - 3)}vw`, `${h.x + (Math.random() * 6 - 3)}vw`]
            }}
            transition={{
              duration: h.duration,
              repeat: Infinity,
              ease: "linear",
              delay: h.delay
            }}
            className="absolute text-rose-400"
            style={{ fontSize: `${h.size}px` }}
          >
            ❤️
          </motion.div>
        ))}
      </div>

      {/* Confetti Particle Canvas overlay */}
      <ConfettiEffect ref={confettiRef} />

      {/* Floating cozy audio player controls */}
      <AudioPlayer />

      {/* 1. INITIAL ENVELOPE GATE SCREEN */}
      <AnimatePresence>
        {!isEnvelopeOpened && (
          <EnvelopeCard
            herName={config.herName}
            relation={config.relation}
            onOpen={() => {
              setIsEnvelopeOpened(true);
              // Trigger a massive joyful burst on entry!
              setTimeout(() => {
                triggerConfettiBurst(window.innerWidth / 2, window.innerHeight / 2, 'hearts', 60);
              }, 400);
            }}
          />
        )}
      </AnimatePresence>

      {/* 2. MAIN CELEBRATION SURPRISE PORTAL */}
      {isEnvelopeOpened && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 w-full max-w-4xl mx-auto px-4 pt-20"
          id="main-celebration-portal"
        >
          
          {/* Customizer Slider Panel */}
          <Customizer
            config={config}
            onSave={handleSaveConfig}
            onReset={handleResetConfig}
          />

          {/* Hero Banner Header */}
          <header className="text-center mb-16 space-y-3" id="main-header">
            <motion.div
              initial={{ scale: 0.5, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white border-2 border-dashed border-rose-300 shadow-lg text-rose-500 text-3xl select-none animate-bounce"
            >
              👑
            </motion.div>

            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="font-serif text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-rose-600 via-pink-500 to-amber-500 bg-clip-text text-transparent px-4 py-1"
            >
              {config.mainGreeting || "Happy Birthday!"}
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-slate-600 font-sans text-xs md:text-sm max-w-xl mx-auto leading-relaxed px-6"
            >
              {config.mainSubtitle || "You make the world beautiful."}
            </motion.p>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 0.5 }}
              className="flex justify-center pt-2"
            >
              <ChevronDown className="w-5 h-5 text-slate-400 animate-bounce" />
            </motion.div>
          </header>

          {/* Dynamic Bento Box Sections Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start" id="bento-container">
            
            {/* Interactive Candle Cake Block (7 cols) */}
            <section className="bg-white rounded-3xl border border-rose-100/60 shadow-xl p-4 md:col-span-7 overflow-hidden relative" id="interactive-cake-block">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-rose-400 via-pink-500 to-amber-400" />
              <BirthdayCake
                herName={config.herName}
                age={config.celebrantAge}
                onAllBlownOut={handleAllCandlesBlownOut}
                triggerConfettiBurst={triggerConfettiBurst}
              />
            </section>

            {/* Balloons Secret Pop Game Block (5 cols) */}
            <section className="bg-white rounded-3xl border border-rose-100/60 shadow-xl p-4 md:col-span-5 overflow-hidden relative" id="interactive-balloons-block">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-400 via-pink-500 to-rose-400" />
              <BalloonGame
                balloons={config.balloons}
                triggerConfettiBurst={triggerConfettiBurst}
              />
            </section>

          </div>

          {/* Sweet Memory Lane Scrolling Timeline Section (Full width) */}
          <section className="bg-white rounded-3xl border border-rose-100/60 shadow-xl p-6 mt-10 overflow-hidden relative" id="memory-lane-block">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-teal-400 via-rose-300 to-purple-400" />
            <MemoryTimeline
              memories={config.memories}
              herName={config.herName}
            />
          </section>

          {/* Vintage Unfolding Stationary Love Letter Card (Full width) */}
          <section className="mt-10" id="sweet-stationary-letter">
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative bg-[#FCFBF7] rounded-3xl border border-amber-100 shadow-2xl p-8 md:p-12 max-w-2xl mx-auto overflow-hidden text-left"
            >
              {/* Cute coffee ring stain or retro decorative borders */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-100/40 rounded-full blur-xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-rose-100/30 rounded-full blur-xl pointer-events-none" />

              {/* Red wax seal border graphic details */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-200/50 via-rose-100/20 to-red-200/50" />

              <div className="flex justify-between items-center pb-6 border-b border-amber-100/70 mb-8">
                <div>
                  <span className="font-cursive text-rose-500 text-2xl font-bold">Unfolding Card</span>
                  <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold font-sans mt-0.5">Written from the heart</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 shadow-inner">
                  <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
                </div>
              </div>

              {/* Letter Paragraph Content with Handwritten typography cursive pairing */}
              <div className="space-y-6">
                <p className="font-cursive text-slate-800 text-3xl font-bold tracking-wide">
                  Dear {config.herName},
                </p>

                <p className="font-sans text-slate-600 text-xs md:text-sm leading-relaxed whitespace-pre-wrap font-medium">
                  {config.letterContent}
                </p>
              </div>

              {/* Decorative signature footer */}
              <div className="mt-10 pt-6 border-t border-amber-100/60 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-rose-500">
                  <Heart className="w-4 h-4 fill-rose-500 animate-pulse" />
                  <span className="text-[10px] uppercase font-bold tracking-widest">Happy Birthday, {config.herName}!</span>
                </div>
                
                <span className="text-[9px] text-amber-500/80 uppercase tracking-widest font-bold">
                  Surprise Locked Forever 🔒
                </span>
              </div>
            </motion.div>
          </section>

          {/* Footer Copyright and sweet warm credits */}
          <footer className="mt-16 text-center text-[10px] text-slate-400 font-medium select-none" id="app-footer">
            <p className="flex items-center justify-center gap-1">
              Made with pure affection <Heart className="w-3 h-3 fill-rose-400 text-rose-400" /> for {config.herName}
            </p>
            <p className="mt-1 opacity-70">
              Made with Love, Just for Chanduu ❤️ — By Manu
            </p>
          </footer>

        </motion.div>
      )}
    </div>
  );
}
