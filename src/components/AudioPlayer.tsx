import { useEffect, useRef, useState } from "react";
import { Music, Volume2, VolumeX, Sparkles, Heart } from "lucide-react";

// Web Audio API Synth Singelton/Helpers for Sound FX
class SoundSynth {
  private ctx: AudioContext | null = null;

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  playPop() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    
    // Bubble Pop Chime
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc1.type = "sine";
    osc2.type = "triangle";

    // Fast frequency slide upwards
    osc1.frequency.setValueAtTime(300, now);
    osc1.frequency.exponentialRampToValueAtTime(800, now + 0.08);

    osc2.frequency.setValueAtTime(150, now);
    osc2.frequency.exponentialRampToValueAtTime(400, now + 0.08);

    gainNode.gain.setValueAtTime(0.15, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.16);
    osc2.stop(now + 0.16);
  }

  playBlow() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Wind blow sound
    const bufferSize = this.ctx.sampleRate * 0.25; // 0.25 seconds
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1; // white noise
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(400, now);
    filter.frequency.exponentialRampToValueAtTime(1200, now + 0.2);
    filter.Q.value = 3.0;

    const gainNode = this.ctx.createGain();
    gainNode.gain.setValueAtTime(0.1, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    noise.start(now);
    noise.stop(now + 0.3);
  }

  playChime(freq: number, duration = 0.5) {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now);

    // Warm harmonics
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = "triangle";
    subOsc.frequency.setValueAtTime(freq / 2, now);

    gainNode.gain.setValueAtTime(0.12, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

    subGain.gain.setValueAtTime(0.04, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gainNode);
    subOsc.connect(subGain);
    
    gainNode.connect(this.ctx.destination);
    subGain.connect(this.ctx.destination);

    osc.start(now);
    subOsc.start(now);
    osc.stop(now + duration + 0.1);
    subOsc.stop(now + duration + 0.1);
  }
}

export const synth = new SoundSynth();

// Global handles for effects
if (typeof window !== "undefined") {
  (window as any).playPopSound = () => synth.playPop();
  (window as any).playBlowSound = () => synth.playBlow();
}

// Chime frequencies for the Happy Birthday song in Key of F Major
// C4 D4 E4 F4 G4 A4 Bb4 C5
const NOTES: Record<string, number> = {
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  F4: 349.23,
  G4: 392.00,
  A4: 440.00,
  Bb4: 466.16,
  C5: 523.25,
  D5: 587.33,
  Bb5: 932.33,
  A5: 880.00,
  G5: 783.99,
  F5: 698.46,
  E5: 659.25,
  REST: 0
};

// Birthday melody sheet (Note name, duration in beats)
const BIRTHDAY_MELODY = [
  { note: "C4", dur: 0.75 }, { note: "C4", dur: 0.25 },
  { note: "D4", dur: 1.0 },
  { note: "C4", dur: 1.0 },
  { note: "F4", dur: 1.0 },
  { note: "E4", dur: 2.0 },

  { note: "C4", dur: 0.75 }, { note: "C4", dur: 0.25 },
  { note: "D4", dur: 1.0 },
  { note: "C4", dur: 1.0 },
  { note: "G4", dur: 1.0 },
  { note: "F4", dur: 2.0 },

  { note: "C4", dur: 0.75 }, { note: "C4", dur: 0.25 },
  { note: "C5", dur: 1.0 },
  { note: "A4", dur: 1.0 },
  { note: "F4", dur: 1.0 },
  { note: "E4", dur: 1.0 },
  { note: "D4", dur: 1.0 },

  { note: "Bb4", dur: 0.75 }, { note: "Bb4", dur: 0.25 },
  { note: "A4", dur: 1.0 },
  { note: "F4", dur: 1.0 },
  { note: "G4", dur: 1.0 },
  { note: "F4", dur: 2.5 },
  
  { note: "REST", dur: 1.0 } // pause
];

// Cozy chord progression pad
// Fmaj7 -> Dm7 -> Gm7 -> C7
const CHORDS = [
  ["F3", "A3", "C4", "E4"], // Fmaj7
  ["D3", "F3", "A3", "C4"], // Dm7
  ["G3", "Bb3", "D4", "F4"], // Gm7
  ["C3", "E3", "G3", "Bb3"]  // C7
];

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [tempo, setTempo] = useState(100); // BPM

  const audioCtxRef = useRef<AudioContext | null>(null);
  const playStateRef = useRef<boolean>(false);
  const timerIdRef = useRef<number | null>(null);
  const currentStepRef = useRef<number>(0);
  const currentChordStepRef = useRef<number>(0);
  const masterGainRef = useRef<GainNode | null>(null);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      const gainNode = audioCtxRef.current.createGain();
      gainNode.gain.setValueAtTime(0.08, audioCtxRef.current.currentTime); // gentle background volume
      gainNode.connect(audioCtxRef.current.destination);
      masterGainRef.current = gainNode;
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
  };

  const playNote = (freq: number, start: number, duration: number, isMelody = true) => {
    const ctx = audioCtxRef.current;
    const masterGain = masterGainRef.current;
    if (!ctx || !masterGain || freq === 0) return;

    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();

    osc.connect(oscGain);
    oscGain.connect(masterGain);

    if (isMelody) {
      // Celestial Music Box chime: Sine with very short attack, exponential decay
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, start);
      
      // Add slight vibrato
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 6; // 6Hz
      lfoGain.gain.value = 3;  // freq variation
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start(start);
      lfo.stop(start + duration);

      oscGain.gain.setValueAtTime(0, start);
      oscGain.gain.linearRampToValueAtTime(0.7, start + 0.01);
      oscGain.gain.exponentialRampToValueAtTime(0.001, start + duration);
    } else {
      // Warm synth chord pad: Triangle wave with a smooth low-pass filter
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, start);

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(350, start);
      
      osc.disconnect(oscGain);
      osc.connect(filter);
      filter.connect(oscGain);

      oscGain.gain.setValueAtTime(0, start);
      oscGain.gain.linearRampToValueAtTime(0.25, start + 0.2); // soft fade in
      oscGain.gain.exponentialRampToValueAtTime(0.001, start + duration - 0.05);
    }

    osc.start(start);
    osc.stop(start + duration);
  };

  const scheduleNextBeats = () => {
    const ctx = audioCtxRef.current;
    if (!ctx || !playStateRef.current) return;

    const beatDuration = 60 / tempo; // duration of 1 beat in seconds
    const lookAhead = 0.5; // schedule 500ms ahead
    
    let now = ctx.currentTime;

    // We schedule the melody note by note
    const step = currentStepRef.current;
    const currentMelodyItem = BIRTHDAY_MELODY[step];
    const duration = currentMelodyItem.dur * beatDuration;

    // Play melody note
    const noteFreq = NOTES[currentMelodyItem.note] || 0;
    playNote(noteFreq, now, duration, true);

    // Dynamic chord pad accompaniments played every 4 beats
    if (step % 6 === 0) {
      const chord = CHORDS[currentChordStepRef.current % CHORDS.length];
      const chordDuration = beatDuration * 6; // pad duration
      chord.forEach((noteName) => {
        // Map notes in chord (e.g. F3 to frequency)
        const baseFreq = NOTES[noteName.replace("3", "4")] / 2; // drop octave
        playNote(baseFreq, now, chordDuration, false);
      });
      currentChordStepRef.current++;
    }

    // Move pointers
    currentStepRef.current = (step + 1) % BIRTHDAY_MELODY.length;

    // Schedule the next check
    timerIdRef.current = window.setTimeout(scheduleNextBeats, duration * 1000);
  };

  const togglePlay = () => {
    initAudio();
    if (isPlaying) {
      playStateRef.current = false;
      if (timerIdRef.current) clearTimeout(timerIdRef.current);
      setIsPlaying(false);
    } else {
      playStateRef.current = true;
      setIsPlaying(true);
      currentStepRef.current = 0;
      currentChordStepRef.current = 0;
      // Start scheduling immediately
      scheduleNextBeats();
      // Little startup chime
      synth.playChime(523.25, 0.4); // C5
    }
  };

  const toggleMute = () => {
    if (masterGainRef.current) {
      const targetVolume = isMuted ? 0.08 : 0;
      masterGainRef.current.gain.setValueAtTime(targetVolume, audioCtxRef.current?.currentTime || 0);
      setIsMuted(!isMuted);
    }
  };

  useEffect(() => {
    return () => {
      playStateRef.current = false;
      if (timerIdRef.current) clearTimeout(timerIdRef.current);
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-[2000] flex items-center gap-3 bg-white/85 backdrop-blur-md px-4 py-2.5 rounded-full shadow-lg border border-rose-100 transition-all duration-300 hover:scale-105 select-none" id="music-box">
      <div className="flex items-center gap-2">
        <button
          onClick={togglePlay}
          className={`p-2 rounded-full cursor-pointer transition-colors ${
            isPlaying ? "bg-rose-500 text-white" : "bg-rose-50 text-rose-500 hover:bg-rose-100"
          }`}
          title={isPlaying ? "Pause Surprise Chime" : "Play Surprise Chime"}
          id="music-play-btn"
        >
          {isPlaying ? (
            <div className="flex gap-0.5 items-end justify-center w-5 h-5">
              <span className="w-1 bg-white rounded-full animate-pulse h-3"></span>
              <span className="w-1 bg-white rounded-full animate-pulse h-4 delay-75"></span>
              <span className="w-1 bg-white rounded-full animate-pulse h-2 delay-150"></span>
              <span className="w-1 bg-white rounded-full animate-pulse h-4 delay-300"></span>
            </div>
          ) : (
            <Music className="w-5 h-5 animate-bounce" />
          )}
        </button>

        {isPlaying && (
          <button
            onClick={toggleMute}
            className="p-1.5 rounded-full text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            id="music-mute-btn"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
          </button>
        )}
      </div>

      <div className="flex flex-col text-left">
        <span className="text-[11px] font-bold tracking-wide text-rose-500 uppercase flex items-center gap-1">
          Surprise Chimes <Sparkles className="w-3 h-3 text-amber-400" />
        </span>
        <span className="text-[10px] text-slate-500 font-medium font-sans">
          {isPlaying ? "Cozy Music Box Mode" : "Tap for Sweet Melodies!"}
        </span>
      </div>
    </div>
  );
}
