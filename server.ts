import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// --- AI Setup ---
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// --- Mock Database / Schemas (Conceptual) ---
// Using objects to simulate successful responses for the demo
const mockUserData = {
  privacyScore: 68,
  exposureLevel: "Medium",
  threatProbability: 12,
  trackingCount: 142,
  recentBreaches: [
    { site: "LinkedIn (2021)", leaked: "Email, Password, Job title" },
    { site: "Adobe (2013)", leaked: "Email, Password hint" }
  ]
};

// --- API Routes ---

// 1. Footprint Analysis
app.post("/api/analyze", async (req, res) => {
  const { dataSource, analysisType } = req.body;
  
  try {
    const prompt = `Act as a cybersecurity AI. Analyze the digital footprint for data source: ${dataSource} and analysis type: ${analysisType}. 
    Provide a JSON response with:
    - riskScore (0-100)
    - top3Threats (array of objects with label and severity)
    - recommendation (string)
    - predictedProfile (string)
    Keep it concise and realistic.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Attempt to parse JSON from AI response
    try {
      const jsonStr = text.match(/\{[\s\S]*\}/)?.[0] || text;
      const data = JSON.parse(jsonStr);
      res.json(data);
    } catch (e) {
      res.json({ 
        riskScore: 45, 
        top3Threats: [{label: "Metadata Exposure", severity: "High"}],
        recommendation: "Use a VPN and clear browser cookies.",
        text: text
      });
    }
  } catch (error) {
    res.status(500).json({ error: "Analysis failed" });
  }
});

// 2. Breach Check
app.get("/api/breaches/:identifier", (req, res) => {
  res.json({
    identifier: req.params.identifier,
    breaches: mockUserData.recentBreaches,
    isExposed: true
  });
});

// 3. Stats
app.get("/api/stats", (req, res) => {
  res.json(mockUserData);
});

// 4. Chatbot Endpoint
app.post("/api/chat", async (req, res) => {
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages array is required." });
  }

  try {
    const aiMessages = messages.map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }],
    }));

    // Start a chat session
    const chatSession = model.startChat({
      history: aiMessages.slice(0, -1),
      systemInstruction: "You are an AI assistant for the 'Sentinel.ai' app. You are known as Sentinel Bot. You help users understand their digital privacy, cyber risks, and data exposure. Be concise, futuristic, and helpful."
    });

    const userMessage = aiMessages[aiMessages.length - 1];
    if (userMessage.role !== 'user') {
      return res.status(400).json({ error: "Last message must be from user." });
    }

    const result = await chatSession.sendMessage(userMessage.parts[0].text);
    const responseText = result.response.text();

    res.json({ text: responseText });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: "Failed to generate AI response." });
  }
});

// 5. Link Analysis
app.post("/api/analyze-link", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "URL is required." });

  try {
    const prompt = `Act as a cybersecurity analyst. Analyze the following URL for potential threats: ${url}. 
    Return a JSON object with:
    - riskLevel: "Low" | "Medium" | "High" | "Critical"
    - summary: A one-sentence summary of findings.
    - threats: Array of strings (e.g., ["Hidden trackers", "Phishing patterns"]).
    - recommendation: Actionable advice.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonStr = text.match(/\{[\s\S]*\}/)?.[0] || text;
    res.json(JSON.parse(jsonStr));
  } catch (error) {
    res.status(500).json({ 
      riskLevel: "Unknown", 
      summary: "Unable to verify link security in real-time.",
      threats: ["Analysis failure"],
      recommendation: "Proceed with extreme caution."
    });
  }
});

// --- Vite Middleware ---
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
}

setupVite().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
});
