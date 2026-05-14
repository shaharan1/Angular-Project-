import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import fs from 'fs';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/patients", (req, res) => {
    const db = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'db.json'), 'utf-8'));
    res.json(db.patients);
  });

  app.get("/api/stats", (req, res) => {
    res.json({
      totalPatients: 12548,
      appointmentsToday: 48,
      bedOccupancy: 82,
      revenue: 1200000
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`HMS Enterprise Server running on http://localhost:${PORT}`);
  });
}

startServer();
