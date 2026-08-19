import express from "express";
import path from "path";
import fs from "fs";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini AI SDK
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", service: "SecretScape Tourism API" });
  });

  // ─── Admin Data Storage ──────────────────────────────────────────────
  const DATA_DIR = path.join(process.cwd(), 'data');
  const DATA_FILE = path.join(DATA_DIR, 'admin-data.json');
  const ADMIN_PASSWORD = 'Jefnela2026@';

  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

  interface AdminData {
    pageViews: number;
    spotViews: Record<string, number>;
    favorites: Record<string, number>;
    messages: Array<{ id: string; name: string; phone: string; email: string; city: string; subject: string; arrivalDate: string; tripDuration: string; adults: string; children: string; budget: string; tripType: string; accommodation: string; transport: string; guide: string; foodPreferences: string; message: string; date: string; read: boolean }>;
    customSpots: any[];
  }

  function loadAdminData(): AdminData {
    try {
      if (fs.existsSync(DATA_FILE)) {
        return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
      }
    } catch {}
    return { pageViews: 0, spotViews: {}, favorites: {}, messages: [], customSpots: [] };
  }

  function saveAdminData(data: AdminData) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  }

  let adminData = loadAdminData();

  // Tracking: page view
  app.post("/api/track/pageview", (_req, res) => {
    adminData.pageViews++;
    saveAdminData(adminData);
    res.json({ ok: true });
  });

  // Tracking: spot view
  app.post("/api/track/spot-view", (req, res) => {
    const { spotId } = req.body;
    if (spotId) {
      adminData.spotViews[spotId] = (adminData.spotViews[spotId] || 0) + 1;
      saveAdminData(adminData);
    }
    res.json({ ok: true });
  });

  // Tracking: favorite toggle
  app.post("/api/track/favorite", (req, res) => {
    const { spotId, action } = req.body;
    if (spotId) {
      adminData.favorites[spotId] = (adminData.favorites[spotId] || 0) + (action === 'add' ? 1 : -1);
      if (adminData.favorites[spotId] < 0) adminData.favorites[spotId] = 0;
      saveAdminData(adminData);
    }
    res.json({ ok: true });
  });

  // Admin: login
  app.post("/api/admin/login", (req, res) => {
    const { password } = req.body;
    if (password === ADMIN_PASSWORD) {
      res.json({ ok: true, token: 'secretscape-admin-2026' });
    } else {
      res.status(401).json({ error: 'Mot de passe incorrect' });
    }
  });

  // Admin: stats
  app.get("/api/admin/stats", (req, res) => {
    if (req.headers['x-admin-token'] !== 'secretscape-admin-2026') {
      return res.status(401).json({ error: 'Non autorisé' });
    }
    const topSpots = Object.entries(adminData.spotViews)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([id, views]) => ({ id, views }));
    const topFavs = Object.entries(adminData.favorites)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([id, count]) => ({ id, count }));
    res.json({
      pageViews: adminData.pageViews,
      totalSpotViews: Object.values(adminData.spotViews).reduce((a, b) => a + b, 0),
      totalFavorites: Object.values(adminData.favorites).reduce((a, b) => a + b, 0),
      totalMessages: adminData.messages.length,
      unreadMessages: adminData.messages.filter(m => !m.read).length,
      totalSpots: adminData.customSpots.length,
      topSpots,
      topFavs,
    });
  });

  // Admin: messages
  app.get("/api/admin/messages", (req, res) => {
    if (req.headers['x-admin-token'] !== 'secretscape-admin-2026') {
      return res.status(401).json({ error: 'Non autorisé' });
    }
    res.json({ messages: adminData.messages.reverse() });
  });

  app.post("/api/admin/messages/read", (req, res) => {
    if (req.headers['x-admin-token'] !== 'secretscape-admin-2026') {
      return res.status(401).json({ error: 'Non autorisé' });
    }
    const { id } = req.body;
    const msg = adminData.messages.find(m => m.id === id);
    if (msg) { msg.read = true; saveAdminData(adminData); }
    res.json({ ok: true });
  });

  app.delete("/api/admin/messages/:id", (req, res) => {
    if (req.headers['x-admin-token'] !== 'secretscape-admin-2026') {
      return res.status(401).json({ error: 'Non autorisé' });
    }
    adminData.messages = adminData.messages.filter(m => m.id !== req.params.id);
    saveAdminData(adminData);
    res.json({ ok: true });
  });

  // Admin: spots CRUD
  app.get("/api/admin/spots", (req, res) => {
    if (req.headers['x-admin-token'] !== 'secretscape-admin-2026') {
      return res.status(401).json({ error: 'Non autorisé' });
    }
    res.json({ spots: adminData.customSpots });
  });

  app.post("/api/admin/spots", (req, res) => {
    if (req.headers['x-admin-token'] !== 'secretscape-admin-2026') {
      return res.status(401).json({ error: 'Non autorisé' });
    }
    const spot = { ...req.body, id: req.body.id || `custom-${Date.now()}` };
    adminData.customSpots.push(spot);
    saveAdminData(adminData);
    res.json({ ok: true, spot });
  });

  app.put("/api/admin/spots/:id", (req, res) => {
    if (req.headers['x-admin-token'] !== 'secretscape-admin-2026') {
      return res.status(401).json({ error: 'Non autorisé' });
    }
    const idx = adminData.customSpots.findIndex(s => s.id === req.params.id);
    if (idx >= 0) {
      adminData.customSpots[idx] = { ...adminData.customSpots[idx], ...req.body };
      saveAdminData(adminData);
    }
    res.json({ ok: true });
  });

  app.delete("/api/admin/spots/:id", (req, res) => {
    if (req.headers['x-admin-token'] !== 'secretscape-admin-2026') {
      return res.status(401).json({ error: 'Non autorisé' });
    }
    adminData.customSpots = adminData.customSpots.filter(s => s.id !== req.params.id);
    saveAdminData(adminData);
    res.json({ ok: true });
  });

  // Contact form: saves to admin data (used by Formspree fallback + direct API)
  app.post("/api/contact", (req, res) => {
    const msg = { ...req.body, id: `msg-${Date.now()}`, date: new Date().toISOString(), read: false };
    adminData.messages.push(msg);
    saveAdminData(adminData);
    res.json({ ok: true });
  });

  // Gemini Route 1: Discover AI Hidden Spots for a city / query
  app.post("/api/gemini/discover-spots", async (req, res) => {
    try {
      const { query, city } = req.body;
      const targetCity = city || query || "Cotonou";

        const prompt = `Génère une liste de 4 à 5 lieux touristiques vraiment cachés, méconnus ou insolites pour la ville/région: "${targetCity}".
Chaque lieu doit être une pépite secrète authentique avec des informations précises (coordonnées GPS réelles approximatives, astuce secrète pour y accéder, meilleur moment de la journée, niveau de secret).
Ne génère JAMAIS de spots de transport (pas de taxis, motos, VTC, pirogues de transport).
Prompt utilisateur spécifique: "${query || "lieux cachés et secrets à visiter"}".`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          systemInstruction: "Tu es un guide de voyage expert en lieux cachés, patrimoine insolite et pépites touristiques secrètes au Bénin et en Afrique de l'Ouest. Tu réponds uniquement en format JSON structuré.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                subtitle: { type: Type.STRING },
                category: { type: Type.STRING, description: "Un parmi: plages, restaurants, boites, distractions, sites, hotels" },
                city: { type: Type.STRING },
                region: { type: Type.STRING },
                lat: { type: Type.NUMBER },
                lng: { type: Type.NUMBER },
                address: { type: Type.STRING },
                secretLevel: { type: Type.STRING, description: "facile, moyen, ou insider" },
                description: { type: Type.STRING },
                secretAccessHint: { type: Type.STRING },
                bestTimeToVisit: { type: Type.STRING },
                estimatedDurationMinutes: { type: Type.NUMBER },
                tags: { type: Type.ARRAY, items: { type: Type.STRING } },
                rating: { type: Type.NUMBER },
                crowdLevel: { type: Type.STRING, description: "faible, modéré, ou élevé" }
              },
              required: ["title", "category", "city", "lat", "lng", "description", "secretAccessHint", "secretLevel"]
            }
          }
        }
      });

      const text = response.text || "[]";
      const rawData = JSON.parse(text);

      // Sanitize and attach image fallbacks (vraies photos du Bénin)
      const imagePool = [
        'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Ganvi%C3%A9_fishing_village_on_stilts_in_Benin_%2810282059623%29_%282%29.jpg/1280px-Ganvi%C3%A9_fishing_village_on_stilts_in_Benin_%2810282059623%29_%282%29.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/0/0f/Coucher_du_soleil_sur_la_plage_Fidjross%C3%A8-Cotonou_Benin.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Parc_national_de_la_Pendjari.JPG/1280px-Parc_national_de_la_Pendjari.JPG',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Porte_du_non_retour_11.jpg/1280px-Porte_du_non_retour_11.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Cotonoucathedral.jpg/1280px-Cotonoucathedral.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Abomey-K%C3%B6nigspalast2.jpg/1280px-Abomey-K%C3%B6nigspalast2.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/c/c0/Lake_Nokoue.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/March%C3%A9_Dantokpa_%28vue_arri%C3%A8re%29.jpg/1280px-March%C3%A9_Dantokpa_%28vue_arri%C3%A8re%29.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/b/bc/Plage_au_sud_du_B%C3%A9nin.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/4/4a/Zemidjan_de_Cotonou.jpg'
      ];

      const spots = rawData.map((item: any, idx: number) => ({
        id: item.id || `ai-spot-${Date.now()}-${idx}`,
        title: item.title,
        subtitle: item.subtitle || "Lieu secret révélé par l'IA",
        category: ['plages', 'restaurants', 'boites', 'distractions', 'sites', 'hotels'].includes(item.category)
          ? item.category
          : 'sites',
        city: item.city || targetCity,
        region: item.region || "Bénin",
        coordinates: {
          lat: Number(item.lat) || 6.3703,
          lng: Number(item.lng) || 2.3912
        },
        address: item.address || `${targetCity}`,
        secretLevel: ['facile', 'moyen', 'insider'].includes(item.secretLevel) ? item.secretLevel : 'moyen',
        description: item.description,
        secretAccessHint: item.secretAccessHint,
        bestTimeToVisit: item.bestTimeToVisit || "Tôt le matin ou fin d'après-midi",
        estimatedDurationMinutes: item.estimatedDurationMinutes || 45,
        imageUrl: imagePool[idx % imagePool.length],
        tags: item.tags || ["Secret", "Insolite"],
        rating: item.rating || 4.8,
        reviewCount: Math.floor(Math.random() * 30) + 12,
        crowdLevel: item.crowdLevel || "faible"
      }));

      res.json({ spots });
    } catch (err: any) {
      console.error("Gemini spot discovery error:", err);
      res.status(500).json({ error: "Erreur lors de la découverte de lieux cachés par l'IA.", details: err.message });
    }
  });

  // Gemini Route 2: Generate Full Day-By-Day Itinerary Calendar
  app.post("/api/gemini/generate-itinerary", async (req, res) => {
    try {
      const { destination, durationDays = 2, pace = 'equilibre', vibes = [], extraNotes = "" } = req.body;

      const prompt = `Crée un calendrier de voyage complet jour par jour pour la destination "${destination}" sur ${durationDays} jour(s).
Le calendrier doit privilégier les lieux cachés, passages secrets, jardins tranquilles et panoramas confidentiels.
Rythme souhaité: ${pace}.
Catégories préférées: ${vibes.join(", ") || "toutes catégories de lieux cachés"}.
Notes supplémentaires: "${extraNotes}".

Pour chaque jour, génère de 3 à 4 étapes réparties sur la journée (Matin 09h30, Midi 12h30, Après-midi 15h00, Coucher de soleil 18h30 ou Soirée 21h00).`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          systemInstruction: "Tu es un concepteur d'itinéraires touristiques sur mesure spécialisé dans le tourisme lent et la découverte de lieux cachés. Réponds sous forme d'un objet JSON strict respectant la structure demandée.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              destinationCity: { type: Type.STRING },
              days: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    dayNumber: { type: Type.INTEGER },
                    title: { type: Type.STRING },
                    items: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          timeSlot: { type: Type.STRING, description: "morning, noon, afternoon, sunset, evening" },
                          timeString: { type: Type.STRING },
                          spotTitle: { type: Type.STRING },
                          subtitle: { type: Type.STRING },
                          category: { type: Type.STRING },
                          lat: { type: Type.NUMBER },
                          lng: { type: Type.NUMBER },
                          address: { type: Type.STRING },
                          secretAccessHint: { type: Type.STRING },
                          description: { type: Type.STRING },
                          bestTimeToVisit: { type: Type.STRING },
                          durationMinutes: { type: Type.NUMBER },
                          notes: { type: Type.STRING }
                        },
                        required: ["timeSlot", "timeString", "spotTitle", "description", "secretAccessHint", "lat", "lng"]
                      }
                    }
                  },
                  required: ["dayNumber", "title", "items"]
                }
              }
            },
            required: ["title", "destinationCity", "days"]
          }
        }
      });

      const text = response.text || "{}";
      const planData = JSON.parse(text);
      res.json({ plan: planData });
    } catch (err: any) {
      console.error("Gemini itinerary error:", err);
      res.status(500).json({ error: "Erreur lors de la création du calendrier de voyage par l'IA.", details: err.message });
    }
  });

  // Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SecretScape Server running on http://localhost:${PORT}`);
  });
}

startServer();
