export interface Memory {
  id: string;
  date: string;
  title: string;
  description: string;
  emoji: string;
}

export interface BalloonMessage {
  id: string;
  color: string;
  message: string;
}

export interface BirthdayConfig {
  herName: string;
  relation: string; // e.g., My Love, Best Friend, Sister
  celebrantAge: string;
  pageTitle: string;
  mainGreeting: string;
  mainSubtitle: string;
  letterContent: string;
  memories: Memory[];
  balloons: BalloonMessage[];
  themeColor: 'rose' | 'amber' | 'lavender' | 'teal' | 'ruby';
  musicTempo: number; // For synth music speed adjustment
  showUnfoldLetter: boolean;
}

export const DEFAULT_CONFIG: BirthdayConfig = {
  herName: "Chanduu👻🥰",
  relation: "favorite One",
  celebrantAge: "21",
  pageTitle: "Happy Birthday Chanduu! ✨",
  mainGreeting: "Happy Birthday, My Precious One!",
  mainSubtitle: "You make the world a warmer, brighter, and more beautiful place. Today, we celebrate the magical person that you are.",
  letterContent: `Dear Chanduu👻🥰,

Today is the day the world was blessed with your laughter, your beautiful heart, and your sweet soul. I wanted to create something special, something that stays forever—just like the wonderful memories we share.

Every day with you feels like a gift. The way you smile, the way you care, and the light you bring into my life is simply irreplaceable. This little space is a small celebration of YOU, your birthday, and the beautiful journey we are on.

I wish you a year filled with endless laughter, boundless success, and the absolute happiest moments. Thank you for being my constant, my joy, and my favorite person in the world.

Always and forever,
With all my love ❤️`,
  memories: [
    {
      id: "m1",
      date: "The Day We Met",
      title: "First Hello",
      description: "That unforgettable moment when our eyes met and our stories intertwined. A simple smile that changed my entire world.",
      emoji: "✨"
    },
    {
      id: "m2",
      date: "Our Coffee Date",
      title: "Spilling Coffee & Secrets",
      description: "Hours flew by like seconds. We talked about everything, from our deepest dreams to our silliest childhood fears.",
      emoji: "☕"
    },
    {
      id: "m3",
      date: "Late Night Walks",
      title: "Under the Starry Canopy",
      description: "Walking hand-in-hand beneath the stars, sharing quiet moments and whispering sweet promises.",
      emoji: "🌙"
    },
    {
      id: "m4",
      date: "Countless Laughs",
      title: "Joy in Small Things",
      description: "Your laughter is my absolute favorite sound in the world. May this year bring you thousands of new reasons to smile.",
      emoji: "🌸"
    }
  ],
  balloons: [
    { id: "b1", color: "from-pink-400 to-rose-500", message: "You are the sweetest part of my day! 🍬" },
    { id: "b2", color: "from-amber-400 to-orange-500", message: "Your laugh is my favorite melody in the world! 🎶" },
    { id: "b3", color: "from-purple-400 to-indigo-500", message: "You deserve all the magic and joy this life offers! 🪄" },
    { id: "b4", color: "from-teal-400 to-emerald-500", message: "Every moment with you is a precious memory. ⏱️" },
    { id: "b5", color: "from-blue-400 to-indigo-500", message: "To the person who holds my heart – Happy Birthday! ❤️" },
    { id: "b6", color: "from-red-400 to-pink-500", message: "You shine brighter than any star in the night sky! ⭐" }
  ],
  themeColor: "lavender",
  musicTempo: 100,
  showUnfoldLetter: true
};
