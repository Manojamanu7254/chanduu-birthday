import { useState } from "react";
import { 
  Settings, X, Sparkles, Save, Heart, Calendar, 
  ChevronRight, HelpCircle, Edit3, Trash2, Wand2, Loader2, RefreshCw 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { BirthdayConfig, Memory, BalloonMessage } from "../types";
import { synth } from "./AudioPlayer";

interface CustomizerProps {
  config: BirthdayConfig;
  onSave: (newConfig: BirthdayConfig) => void;
  onReset: () => void;
}

const THEMES = [
  { id: "rose", name: "Romantic Rose", bg: "bg-rose-500" },
  { id: "amber", name: "Golden Glow", bg: "bg-amber-500" },
  { id: "lavender", name: "Lavender Dream", bg: "bg-purple-500" },
  { id: "teal", name: "Mint Fresh", bg: "bg-teal-500" },
  { id: "ruby", name: "Ruby Sunset", bg: "bg-red-500" }
] as const;

export default function Customizer({ config, onSave, onReset }: CustomizerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'memories' | 'balloons' | 'letter'>('general');
  
  // Local form state
  const [form, setForm] = useState<BirthdayConfig>(config);
  
  // AI Generator state
  const [aiTone, setAiTone] = useState<string>("deeply romantic and emotional");
  const [aiKeywords, setAiKeywords] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [genAlert, setGenAlert] = useState<string | null>(null);

  // Sync state with incoming config updates
  useState(() => {
    setForm(config);
  });

  const handleFieldChange = (field: keyof BirthdayConfig, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleMemoryChange = (id: string, field: keyof Memory, value: string) => {
    const updatedMemories = form.memories.map(m => 
      m.id === id ? { ...m, [field]: value } : m
    );
    setForm(prev => ({ ...prev, memories: updatedMemories }));
  };

  const handleBalloonChange = (id: string, value: string) => {
    const updatedBalloons = form.balloons.map(b => 
      b.id === id ? { ...b, message: value } : b
    );
    setForm(prev => ({ ...prev, balloons: updatedBalloons }));
  };

  const handleSave = () => {
    onSave(form);
    setIsOpen(false);
    synth.playChime(523.25, 0.4); // C5 high chime success
    
    // Quick custom browser animation effect
    const btn = document.getElementById("customize-toggle-btn");
    if (btn) {
      btn.classList.add("animate-ping");
      setTimeout(() => btn.classList.remove("animate-ping"), 600);
    }
  };

  const handleAIGenerateLetter = async () => {
    setIsGenerating(true);
    setGenAlert(null);
    synth.playChime(329.63, 0.2); // sweet pitch

    try {
      const res = await fetch("/api/generate-poem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.herName,
          relation: form.relation,
          tone: aiTone,
          keywords: aiKeywords
        })
      });

      const data = await res.json();
      if (data.poem) {
        handleFieldChange('letterContent', data.poem);
        synth.playChime(523.25, 0.5); // success chime
        if (data.warning) {
          setGenAlert(data.warning);
        } else {
          setGenAlert("Poem generated beautifully by Gemini! ❤️ Feel free to edit or keep it.");
        }
      }
    } catch (err) {
      console.error(err);
      setGenAlert("Failed to connect to AI writing helper. Fallback letter applied instead.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      

      {/* Slide-over Control Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Dark blur overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-900 z-[4900] backdrop-blur-xs cursor-pointer"
            />

            {/* Main Panel Content */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 20, stiffness: 120 }}
              className="fixed top-0 bottom-0 left-0 w-full max-w-md bg-white z-[4950] border-r border-slate-100 shadow-2xl flex flex-col"
              id="customizer-panel"
            >
              {/* Header */}
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-rose-50 to-pink-50/30">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center text-white shadow-md">
                    <Heart className="w-4.5 h-4.5 fill-white" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-slate-800 text-base">Surprise Customizer</h3>
                    <p className="text-[10px] text-slate-500 font-sans uppercase tracking-widest">Personalize her birthday site</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Tabs */}
              <div className="flex border-b border-slate-100 bg-slate-50 px-2.5 py-1">
                {(['general', 'memories', 'balloons', 'letter'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 text-center font-sans text-xs py-2 rounded-lg cursor-pointer transition-all uppercase tracking-wide font-semibold ${
                      activeTab === tab 
                        ? "bg-white text-rose-500 shadow-xs" 
                        : "text-slate-500 hover:text-slate-800 hover:bg-slate-100/50"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Scrollable Form Area */}
              <div className="flex-1 overflow-y-auto p-5 space-y-5 text-left font-sans text-xs">
                
                {/* 1. GENERAL TAB */}
                {activeTab === 'general' && (
                  <div className="space-y-4">
                    <h4 className="font-serif font-bold text-sm text-slate-700 pb-1 border-b border-slate-100 flex items-center gap-1.5">
                      👩 Celebrant Basics
                    </h4>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Her Name</label>
                        <input
                          type="text"
                          value={form.herName}
                          onChange={(e) => handleFieldChange('herName', e.target.value)}
                          className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-rose-400 focus:outline-none"
                          placeholder="e.g., Chanduu👻🥰"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Relation / Title</label>
                        <input
                          type="text"
                          value={form.relation}
                          onChange={(e) => handleFieldChange('relation', e.target.value)}
                          className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-rose-400 focus:outline-none"
                          placeholder="e.g., My Love"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="col-span-1">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Age</label>
                        <input
                          type="text"
                          value={form.celebrantAge}
                          onChange={(e) => handleFieldChange('celebrantAge', e.target.value)}
                          className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-rose-400 focus:outline-none text-center"
                          placeholder="e.g., 21"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Page Title</label>
                        <input
                          type="text"
                          value={form.pageTitle}
                          onChange={(e) => handleFieldChange('pageTitle', e.target.value)}
                          className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-rose-400 focus:outline-none"
                          placeholder="Happy Birthday Chanduu! ✨"
                        />
                      </div>
                    </div>

                    <h4 className="font-serif font-bold text-sm text-slate-700 pt-3 pb-1 border-b border-slate-100 flex items-center gap-1.5">
                      💬 Landing Page Copy
                    </h4>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Main Greeting Heading</label>
                      <input
                        type="text"
                        value={form.mainGreeting}
                        onChange={(e) => handleFieldChange('mainGreeting', e.target.value)}
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-rose-400 focus:outline-none"
                        placeholder="Happy Birthday, My Precious One!"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Greeting Subtitle Paragraph</label>
                      <textarea
                        value={form.mainSubtitle}
                        onChange={(e) => handleFieldChange('mainSubtitle', e.target.value)}
                        rows={3}
                        className="w-full border border-slate-200 rounded-xl p-3 text-xs focus:ring-1 focus:ring-rose-400 focus:outline-none leading-relaxed"
                        placeholder="Sweet intro copy..."
                      />
                    </div>

                    <h4 className="font-serif font-bold text-sm text-slate-700 pt-3 pb-1 border-b border-slate-100 flex items-center gap-1.5">
                      🎨 Theme Styling
                    </h4>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Color Palette</label>
                      <div className="flex gap-2.5 mt-1.5">
                        {THEMES.map((theme) => (
                          <button
                            key={theme.id}
                            onClick={() => handleFieldChange('themeColor', theme.id)}
                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer border ${
                              form.themeColor === theme.id 
                                ? "ring-2 ring-offset-2 ring-rose-500 border-transparent scale-110 shadow-md" 
                                : "border-slate-200 hover:scale-105"
                            }`}
                            title={theme.name}
                          >
                            <span className={`w-6 h-6 rounded-lg shadow-inner ${theme.bg}`} />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. MEMORIES TAB */}
                {activeTab === 'memories' && (
                  <div className="space-y-4">
                    <h4 className="font-serif font-bold text-sm text-slate-700 pb-1 border-b border-slate-100 flex items-center gap-1.5">
                      🗺️ Memory Lane Highlights
                    </h4>
                    <p className="text-slate-400 text-[10px] leading-relaxed -mt-2">
                      Edit the chronological memories that show up in the scrolling timeline box. Add nice dates and emojis!
                    </p>

                    {form.memories.map((m, idx) => (
                      <div key={m.id} className="bg-slate-50 rounded-2xl p-4 border border-slate-100 relative space-y-3">
                        <div className="absolute top-2 right-3 text-[11px] font-bold text-slate-300">
                          #{idx + 1}
                        </div>

                        <div className="grid grid-cols-4 gap-2">
                          <div className="col-span-1">
                            <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Emoji</label>
                            <input
                              type="text"
                              value={m.emoji}
                              onChange={(e) => handleMemoryChange(m.id, 'emoji', e.target.value)}
                              className="w-full border border-slate-200 rounded-lg px-2 py-1 text-center font-sans text-sm focus:outline-none focus:ring-1 focus:ring-rose-400 bg-white"
                              maxLength={2}
                            />
                          </div>
                          <div className="col-span-3">
                            <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Time Period / Date</label>
                            <input
                              type="text"
                              value={m.date}
                              onChange={(e) => handleMemoryChange(m.id, 'date', e.target.value)}
                              className="w-full border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-rose-400 bg-white"
                              placeholder="e.g., Summer 2024"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Title</label>
                          <input
                            type="text"
                            value={m.title}
                            onChange={(e) => handleMemoryChange(m.id, 'title', e.target.value)}
                            className="w-full border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-rose-400 bg-white"
                            placeholder="e.g., Late Night Walks"
                          />
                        </div>

                        <div>
                          <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Sweet Description</label>
                          <textarea
                            value={m.description}
                            onChange={(e) => handleMemoryChange(m.id, 'description', e.target.value)}
                            rows={2}
                            className="w-full border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-rose-400 bg-white leading-relaxed"
                            placeholder="What happened? Tell her..."
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 3. BALLOONS TAB */}
                {activeTab === 'balloons' && (
                  <div className="space-y-4">
                    <h4 className="font-serif font-bold text-sm text-slate-700 pb-1 border-b border-slate-100 flex items-center gap-1.5">
                      🎈 Floating Balloon Secrets
                    </h4>
                    <p className="text-slate-400 text-[10px] leading-relaxed -mt-2">
                      When she pops a balloon, these sweet customized secrets and messages are revealed. Fill them with private inside jokes!
                    </p>

                    {form.balloons.map((b, idx) => (
                      <div key={b.id} className="flex gap-2 items-center">
                        <div className="flex-none w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 font-bold font-sans">
                          {idx + 1}
                        </div>
                        <input
                          type="text"
                          value={b.message}
                          onChange={(e) => handleBalloonChange(b.id, e.target.value)}
                          className="flex-1 border border-slate-200 rounded-xl px-3 py-2 focus:ring-1 focus:ring-rose-400 focus:outline-none bg-white"
                          placeholder={`Sweet message #${idx + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* 4. LETTER TAB */}
                {activeTab === 'letter' && (
                  <div className="space-y-4">
                    <h4 className="font-serif font-bold text-sm text-slate-700 pb-1 border-b border-slate-100 flex items-center gap-1.5">
                      💌 Heartfelt Unfolding Letter
                    </h4>
                    <p className="text-slate-400 text-[10px] leading-relaxed -mt-2">
                      This represents the central unfolding card. Write a detailed, loving message, or use our **Gemini AI helper** below!
                    </p>

                    <div>
                      <textarea
                        value={form.letterContent}
                        onChange={(e) => handleFieldChange('letterContent', e.target.value)}
                        rows={8}
                        className="w-full border border-slate-200 rounded-xl p-3 text-xs font-sans focus:ring-1 focus:ring-rose-400 focus:outline-none leading-relaxed bg-amber-50/10"
                        placeholder="Dear Chanduu👻🥰..."
                      />
                    </div>

                    {/* Gemini AI Writing Helper Panel */}
                    <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-4 space-y-3.5">
                      <div className="flex items-center gap-1.5 text-rose-600 font-serif font-bold text-xs">
                        <Wand2 className="w-4 h-4 text-rose-500 animate-pulse" /> Gemini AI Writing Assistant
                      </div>
                      
                      <p className="text-slate-500 text-[9px] leading-relaxed">
                        Need help finding the perfect words? Describe your relation, choose a tone, add a few keywords, and let Gemini write a beautiful custom card.
                      </p>

                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Poem/Card Tone</label>
                        <select
                          value={aiTone}
                          onChange={(e) => setAiTone(e.target.value)}
                          className="w-full border border-slate-200 rounded-lg px-2 py-1.5 bg-white text-slate-600 focus:outline-none"
                        >
                          <option value="deeply romantic, poetic and emotional">Romantic & Emotional ❤️</option>
                          <option value="cozy, warm, cute and highly affectionate">Cozy, Cute & Sweet 🌸</option>
                          <option value="playful, humorous, friendly and warm">Playful & Humorous 🤪</option>
                          <option value="nostalgic, recalling happy memories">Nostalgic & Reflective 📸</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Keywords & Inside Jokes (Optional)</label>
                        <input
                          type="text"
                          value={aiKeywords}
                          onChange={(e) => setAiKeywords(e.target.value)}
                          className="w-full border border-slate-200 rounded-lg px-2 py-1.5 bg-white text-slate-600 focus:outline-none"
                          placeholder="e.g., spilling tea, cat smiles, late chats"
                        />
                      </div>

                      <button
                        onClick={handleAIGenerateLetter}
                        disabled={isGenerating}
                        className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-2 rounded-xl shadow-sm transition-all hover:shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Drafting Letter with Gemini...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5" /> Compose Card with Gemini
                          </>
                        )}
                      </button>

                      {genAlert && (
                        <div className="bg-white/80 p-2.5 rounded-xl border border-rose-100 text-[10px] text-rose-600 leading-relaxed">
                          {genAlert}
                        </div>
                      )}
                    </div>
                  </div>
                )}

              </div>

              {/* Sticky Footer Action Bar */}
              <div className="p-4 border-t border-slate-100 bg-slate-50 flex gap-2">
                <button
                  onClick={() => {
                    onReset();
                    setIsOpen(false);
                    synth.playChime(261.63, 0.4); // C4 base pitch reset
                  }}
                  className="flex-none border border-slate-200 hover:bg-slate-100 text-slate-500 font-bold px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
                  title="Reset to Defaults"
                >
                  Reset
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-bold py-2.5 rounded-xl shadow-md hover:shadow-lg hover:scale-[1.01] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" /> Save Surprise ❤️
                </button>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
