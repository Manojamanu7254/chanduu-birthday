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
  letterContent: `Dear Chanduu 👻🥰,

Happy Birthday to my most favorite person, my precious Kandamma.

On this beautiful day, I just want to remind you how much you mean to me. You bring a special kind of happiness into my life, turning ordinary days into unforgettable memories.

My sweet Kandamma,
You are my comfort, my happy place,
The gentlest smile upon my face.
With your cute little ways and your heart so true,
There is absolutely no one in this world like you.

I love the way you make life feel brighter and happier just by being yourself. Every conversation, every laugh, and every memory with you has become something I deeply cherish.

May your day be filled with happiness,
With endless giggles and your favorite sweet treats.
May your heart be light and your beautiful eyes bright,
As you walk through a year where every dream meets.

Thank you for being such an important part of my life. Your presence, support, and friendship mean more to me than words can ever express. You are truly special, Chanduu, today and always.

Happy Birthday, my dear Kandamma.
May this year bring you all the happiness, success, and beautiful moments you deserve.

With lots of love and warm wishes ❤️
`,
  memories: [
    {
      id: "m1",
      date: "The Day We Met",
      title: "First Hello",
      description: "That simple hello became one of the most beautiful parts of my life. Little did I know that day would bring someone so special into my world.",
      emoji: "✨"
    },
    {
      id: "m2",
      date: "Our Secrets",
      title: "Spilling Ice Creams & Secrets",
      description: "Hours passed without us noticing. Every conversation, every laugh, and every shared thought became a memory I will always treasure.",
      emoji: "🍦"
    },
    {
      id: "m3",
      date: "Our Conversations",
      title: "Under the Starry Canopy",
      description: "No matter what we talked about, every moment felt comfortable and genuine. Those conversations became some of my favorite memories.",
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
