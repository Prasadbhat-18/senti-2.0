import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// --- MongoDB Setup ---
const MONGODB_URI = process.env.MONGODB_URI;
let dbConnected = false;

if (MONGODB_URI && (MONGODB_URI.startsWith("mongodb://") || MONGODB_URI.startsWith("mongodb+srv://"))) {
  mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 })
    .then(() => {
      console.log("Connected to MongoDB successfully");
      dbConnected = true;
    })
    .catch((err: any) => {
      console.error("MongoDB connection error:", err.message);
      console.error("ATTENTION: If using MongoDB Atlas, you MUST whitelist 0.0.0.0/0 in 'Network Access' because the app's IP is dynamic.");
    });
} else if (MONGODB_URI) {
  console.error("Invalid MONGODB_URI scheme. It must start with 'mongodb://' or 'mongodb+srv://'. Data will not be persisted.");
} else {
  console.warn("MONGODB_URI not found in environment. Data will not be persisted.");
}

const AnalysedLinkSchema = new mongoose.Schema({
  url: { type: String, required: true },
  riskLevel: String,
  summary: String,
  threats: [String],
  recommendation: String,
  timestamp: { type: Date, default: Date.now }
});

const AnalysedLink = mongoose.models.AnalysedLink || mongoose.model("AnalysedLink", AnalysedLinkSchema);

const IdentityScanSchema = new mongoose.Schema({
  identifier: { type: String, required: true },
  type: String, // 'email' or 'phone'
  isExposed: Boolean,
  breaches: [{
    site: String,
    date: String,
    dataClasses: [String],
    severity: String
  }],
  appsCausingLeak: [String],
  riskScore: Number,
  timestamp: { type: Date, default: Date.now }
});

const IdentityScan = mongoose.models.IdentityScan || mongoose.model("IdentityScan", IdentityScanSchema);

// --- AI Setup ---
const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});
const MODEL_NAME = "gemini-2.5-flash";

// --- API Routes ---

// 1. Footprint Analysis
app.post("/api/analyze", async (req, res) => {
  const { dataSource, analysisType } = req.body;
  
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Act as a cybersecurity AI. Analyze the digital footprint for data source: ${dataSource} and analysis type: ${analysisType}. 
      Provide a JSON response with:
      - riskScore (0-100)
      - top3Threats (array of objects with label and severity)
      - recommendation (string)
      - predictedProfile (string)
      Keep it concise and realistic.`,
      config: { responseMimeType: "application/json" }
    });
    
    const text = response.text || "";
    try {
      const data = JSON.parse(text);
      res.json(data);
    } catch (e) {
      res.json({ 
        riskScore: 45, 
        top3Threats: [{label: "Metadata Exposure", severity: "High"}],
        recommendation: "Use a VPN and clear browser cookies.",
      });
    }
  } catch (error: any) {
    console.error("AI Analysis error:", error.message);
    res.json({ 
      riskScore: 0, 
      top3Threats: [],
      recommendation: "System check failed. Please retry scan.",
      predictedProfile: "Unknown"
    });
  }
});

// 2. Breach Check
app.post("/api/analyse-identity", async (req, res) => {
  const { identifier } = req.body;
  if (!identifier) return res.status(400).json({ error: "Identifier is required" });

  const type = (identifier.includes('@') && identifier.includes('.')) ? 'email' : 'phone';

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Act as a Digital Privacy Auditor. Analyze the ${type}: "${identifier}". 
      Investigate known major data breaches and privacy leaks associated with this type of identifier.
      Return ONLY a JSON object with:
      - isExposed: boolean
      - riskScore: number (0-100)
      - breaches: Array of { site: string, date: string, dataClasses: string[], severity: "Low" | "Medium" | "High" | "Critical" }
      - appsCausingLeak: string[] (List of platforms/apps known to have leaked or aggressively shared such data)
      Be realistic based on historical data breaches.`,
      config: { responseMimeType: "application/json" }
    });

    const text = response.text || "{}";
    const analysis = JSON.parse(text);

    if (dbConnected) {
      await new IdentityScan({
        identifier,
        type,
        ...analysis
      }).save();
    }

    res.json(analysis);
  } catch (error: any) {
    console.error("Identity analysis error:", error.message);
    res.json({
      isExposed: false,
      riskScore: 0,
      breaches: [],
      appsCausingLeak: []
    });
  }
});

// 3. Stats (Aggregated from DB)
app.get("/api/stats", async (req, res) => {
  try {
    if (!dbConnected) {
      return res.json({
        privacyScore: 0,
        exposureLevel: "None",
        threatProbability: 0,
        trackingCount: 0,
        activeThreats: 0,
        vulnerabilities: 0,
        threatTrend: [],
        riskDistribution: []
      });
    }

    const totalScans = await AnalysedLink.countDocuments();
    const identityScansCount = await IdentityScan.countDocuments();
    
    if (totalScans === 0 && identityScansCount === 0) {
      return res.json({
        privacyScore: 0,
        exposureLevel: "None",
        threatProbability: 0,
        trackingCount: 0,
        activeThreats: 0,
        vulnerabilities: 0,
        threatTrend: [],
        riskDistribution: []
      });
    }

    const highRiskLinkCount = await AnalysedLink.countDocuments({ riskLevel: { $in: ['High', 'Critical'] } });
    const exposedIdentityCount = await IdentityScan.countDocuments({ isExposed: true });
    
    const criticalCount = await AnalysedLink.countDocuments({ riskLevel: 'Critical' });
    const mediumRiskCount = await AnalysedLink.countDocuments({ riskLevel: 'Medium' });
    const lowRiskCount = await AnalysedLink.countDocuments({ riskLevel: 'Low' });

    // Calculate a dynamic privacy score
    const baseScore = 98;
    const penalty = (criticalCount * 20) + (highRiskLinkCount * 12) + (mediumRiskCount * 4) + (exposedIdentityCount * 15);
    const privacyScore = Math.max(8, Math.min(98, baseScore - penalty));

    // Get trend data (last 7 actions)
    const recentScans = await AnalysedLink.find().sort({ timestamp: -1 }).limit(7);
    const threatTrend = recentScans.map((s, i) => ({
      name: `T-${i}`,
      value: s.riskLevel === 'Critical' ? 90 : s.riskLevel === 'High' ? 70 : s.riskLevel === 'Medium' ? 40 : 15
    })).reverse();

    res.json({
      privacyScore,
      exposureLevel: privacyScore > 80 ? "Low" : privacyScore > 45 ? "Medium" : "High",
      threatProbability: (criticalCount > 0 || highRiskLinkCount > 0) ? Math.min(99, 12 + ((criticalCount + highRiskLinkCount) * 15)) : 5,
      trackingCount: (totalScans * 28) + (identityScansCount * 85), 
      activeThreats: highRiskLinkCount + mediumRiskCount + exposedIdentityCount,
      vulnerabilities: highRiskLinkCount + exposedIdentityCount,
      threatTrend: threatTrend,
      riskDistribution: [
        { name: 'Critical', value: criticalCount + await IdentityScan.countDocuments({ riskScore: { $gt: 80 } }) },
        { name: 'High', value: await AnalysedLink.countDocuments({ riskLevel: 'High' }) + await IdentityScan.countDocuments({ riskScore: { $gt: 60, $lte: 80 } }) },
        { name: 'Medium', value: mediumRiskCount + await IdentityScan.countDocuments({ riskScore: { $gt: 30, $lte: 60 } }) },
        { name: 'Low', value: lowRiskCount + await IdentityScan.countDocuments({ riskScore: { $lte: 30 } }) }
      ]
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// 4. Chatbot Endpoint
app.post("/api/chat", async (req, res) => {
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages array is required." });
  }

  try {
    const userMessage = messages[messages.length - 1];
    if (userMessage.role !== 'user') {
      return res.status(400).json({ error: "Last message must be from user." });
    }

    const history = messages.slice(0, -1).map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: String(m.text || "") }],
    }));

    const responseStream = await ai.models.generateContentStream({
      model: MODEL_NAME,
      contents: [
        ...history,
        { role: 'user', parts: [{ text: userMessage.text }] }
      ],
      config: {
        systemInstruction: "You are an AI assistant for 'Sentinel.ai'. You help users analyze privacy risks. Be concise, futuristic, and helpful."
      }
    });

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    });

    for await (const chunk of responseStream) {
      if (chunk.text) {
         res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
      }
    }
    
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error: any) {
    console.error("Chat error:", error.message);
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to generate AI response." });
    } else {
      res.end();
    }
  }
});

// 5. Link Analysis
app.post("/api/analyze-link", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "URL is required." });

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Act as a cybersecurity analyst. Analyze the following URL for potential threats: ${url}. 
      Return ONLY a JSON object with:
      - riskLevel: "Low" | "Medium" | "High" | "Critical"
      - summary: A one-sentence summary of findings.
      - threats: Array of strings.
      - recommendation: Actionable advice.`,
      config: { responseMimeType: "application/json" }
    });
    
    const data = JSON.parse(response.text || "{}");

    if (dbConnected) {
      await new AnalysedLink({
        url,
        ...data
      }).save();
    }

    res.json(data);
  } catch (error: any) {
    console.error("Link analysis error:", error.message);
    res.json({ 
      riskLevel: "Medium", 
      summary: "Dynamic scan engine unavailable. Manual check required.",
      threats: ["Scan Timeout"],
      recommendation: "Avoid sensitive data entry."
    });
  }
});

// 6. Utils
app.get("/api/db-status", (req, res) => {
  res.json({ 
    connected: dbConnected, 
    readyState: mongoose.connection.readyState 
  });
});

app.get("/api/link-history", async (req, res) => {
  try {
    if (!dbConnected) return res.json([]);
    const history = await AnalysedLink.find().sort({ timestamp: -1 }).limit(10);
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

// --- Vite Middleware & Core Launch ---
export const apiApp = app;

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

// Only start the server if not running in a Netlify Function / AWS Lambda
if (!process.env.AWS_LAMBDA_FUNCTION_NAME) {
  setupVite().then(() => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  });
}
