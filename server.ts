import express from "express";
import { createServer as createViteServer } from "vite";
import { OAuth2Client } from "google-auth-library";
import cookieSession from "cookie-session";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";
import { analyzeTitle, PRGIError } from "./src/services/geminiService.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Database Setup
const db = new Database("prgi.db");
db.exec(`
  CREATE TABLE IF NOT EXISTS history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    verdict TEXT NOT NULL,
    probability INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Google OAuth Client
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.warn("WARNING: GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET is missing. Google Login will not work.");
}

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);

app.use(express.json());
app.use(
  cookieSession({
    name: "session",
    keys: [process.env.SESSION_SECRET || "prgi-secret-key"],
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    secure: true,
    sameSite: "none",
    httpOnly: true,
  })
);

// API Routes
app.get("/api/auth/google/url", (req, res) => {
  const redirectUri = `${process.env.APP_URL || "http://localhost:3000"}/api/auth/google/callback`;
  const url = client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
    redirect_uri: redirectUri,
  });
  res.json({ url });
});

app.get("/api/auth/google/callback", async (req, res) => {
  const { code } = req.query;
  const redirectUri = `${process.env.APP_URL || "http://localhost:3000"}/api/auth/google/callback`;

  try {
    const { tokens } = await client.getToken({
      code: code as string,
      redirect_uri: redirectUri,
    });
    client.setCredentials(tokens);

    const userInfoResponse = await client.request({
      url: "https://www.googleapis.com/oauth2/v3/userinfo",
    });

    const userData = userInfoResponse.data as any;
    
    if (req.session) {
      req.session.user = {
        id: userData.sub,
        name: userData.name,
        email: userData.email,
        picture: userData.picture,
      };
    }

    res.send(`
      <html>
        <body>
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS' }, '*');
              window.close();
            } else {
              window.location.href = '/';
            }
          </script>
          <p>Authentication successful. This window should close automatically.</p>
        </body>
      </html>
    `);
  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(500).send("Authentication failed");
  }
});

app.get("/api/auth/me", (req, res) => {
  if (req.session && req.session.user) {
    res.json({ user: req.session.user });
  } else {
    res.status(401).json({ error: "Not authenticated" });
  }
});

app.post("/api/auth/logout", (req, res) => {
  req.session = null;
  res.json({ success: true });
});

// Analysis API (Secure Server-Side)
app.post("/api/analyze", async (req, res) => {
  const { title } = req.body;
  
  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  try {
    const result = await analyzeTitle(title);
    res.json(result);
  } catch (error: any) {
    console.error("Server-side analysis error:", error);
    if (error instanceof PRGIError) {
      res.status(400).json({ code: error.code, message: error.message });
    } else {
      res.status(500).json({ error: error.message || "Internal server error during analysis" });
    }
  }
});

app.get("/api/history", (req, res) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const userId = req.session.user.id;
  const history = db.prepare("SELECT * FROM history WHERE user_id = ? ORDER BY created_at DESC LIMIT 50").all(userId);
  res.json({ history });
});

app.post("/api/history", (req, res) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const { title, verdict, probability } = req.body;
  const userId = req.session.user.id;

  if (!title || !verdict) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const stmt = db.prepare("INSERT INTO history (user_id, title, verdict, probability) VALUES (?, ?, ?, ?)");
  stmt.run(userId, title, verdict, probability);

  res.json({ success: true });
});

app.delete("/api/history/:id", (req, res) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const { id } = req.params;
  const userId = req.session.user.id;

  const stmt = db.prepare("DELETE FROM history WHERE id = ? AND user_id = ?");
  const result = stmt.run(id, userId);

  if (result.changes > 0) {
    res.json({ success: true });
  } else {
    res.status(404).json({ error: "History item not found" });
  }
});

// Vite middleware for development
if (process.env.NODE_ENV !== "production") {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.join(__dirname, "dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
  });
}

app.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
  console.log(`App URL: ${process.env.APP_URL || "Not set"}`);
  console.log(`Environment Diagnostics:`);
  console.log(`- GEMINI_API_KEY: ${process.env.GEMINI_API_KEY ? "Set (starts with " + process.env.GEMINI_API_KEY.substring(0, 4) + ")" : "Not set"}`);
  console.log(`- API_KEY: ${process.env.API_KEY ? "Set (starts with " + process.env.API_KEY.substring(0, 4) + ")" : "Not set"}`);
  console.log(`- NODE_ENV: ${process.env.NODE_ENV}`);
});
