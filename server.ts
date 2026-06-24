import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy initialize Gemini client to prevent crash on startup if key is missing
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      throw new Error("GEMINI_API_KEY environment variable is missing or placeholder.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Endpoint to generate customized birthday poem / message
app.post("/api/generate-poem", async (req, res) => {
  const { name, relation, tone, keywords } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name is required." });
  }

  try {
    const ai = getGeminiClient();
    
    const prompt = `Write a beautiful, sweet, customized birthday poem/letter for a person named "${name}" who is my "${relation || 'loved one'}". 
    The tone of the writing should be "${tone || 'romantic and affectionate'}". 
    Include the following keywords/inside jokes/memories if provided: "${keywords || 'none'}".
    
    Make it highly personal, heartwarming, emotional, and well-structured with elegant spacing (use line breaks). 
    Do not include any robotic markdown headings, titles, intro, or outro text like "Here is your poem:". Just output the direct poem/letter content starting with "Dear ${name}," and ending with a sweet signature like "With all my love ❤️".`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        temperature: 0.85,
      }
    });

    const poemText = response.text || "";
    return res.json({ poem: poemText });
  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    
    // Graceful fallback if Gemini API Key is missing or invalid
    const fallbackPoem = `Dear ${name},

Today, we celebrate the incredible, bright, and beautiful person that you are. You make every ordinary day feel like an extraordinary gift. Your kindness, your laugh, and the simple warmth of your presence brings endless sunshine to my world.

On this special birthday, I want to thank you for being the most wonderful ${relation || 'companion'} anyone could ever ask for. I hope your day is filled with the same boundless joy and love that you give to everyone around you.

May all your dreams, big and small, find their way to you this year. Happy Birthday from the bottom of my heart!

With all my love ❤️`;

    return res.json({ 
      poem: fallbackPoem, 
      warning: "Generating using fallback engine (Gemini API key is not fully configured yet)." 
    });
  }
});

// Vite Middleware & Static Asset Serving Setup
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Vite dev middleware is initializing...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving compiled production assets...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

setupVite();
