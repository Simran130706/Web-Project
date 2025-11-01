import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Path to JSON data
const dataPath = path.join(__dirname, "data", "shows.json");

// Utility functions
const readShows = () => {
  try {
    return JSON.parse(fs.readFileSync(dataPath, "utf-8"));
  } catch {
    return [];
  }
};

const writeShows = (data) => {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
};

// === API Routes ===

// READ all shows
app.get("/api/shows", (req, res) => {
  res.json(readShows());
});

// CREATE new show
app.post("/api/shows", (req, res) => {
  const shows = readShows();
  const newShow = { id: Date.now(), ...req.body };
  shows.push(newShow);
  writeShows(shows);
  res.json(newShow);
});

// UPDATE a show
app.put("/api/shows/:id", (req, res) => {
  const shows = readShows();
  const id = parseInt(req.params.id);
  const index = shows.findIndex((s) => s.id === id);
  if (index === -1) return res.status(404).json({ message: "Show not found" });

  shows[index] = { ...shows[index], ...req.body };
  writeShows(shows);
  res.json(shows[index]);
});

// DELETE a show
app.delete("/api/shows/:id", (req, res) => {
  let shows = readShows();
  const id = parseInt(req.params.id);
  shows = shows.filter((s) => s.id !== id);
  writeShows(shows);
  res.json({ message: "Deleted successfully" });
});

// Default route
app.get("/", (req, res) => {
  res.send("✅ Show Tracker backend running!");
});

// Start server
app.listen(PORT, () => console.log(`🚀 Server started at http://localhost:${PORT}`));
