/**
 * gemini-proxy/server.js
 *
 * Dual-mode Gemini proxy:
 * - If GEMINI_API_KEY present -> call generativelanguage endpoint with ?key=API_KEY
 * - Else if GOOGLE_APPLICATION_CREDENTIALS present -> mint access token and call with Bearer token
 *
 * Exposes:
 * - GET  /               -> text health
 * - GET  /api/health     -> json health
 * - POST /api/gemini     -> { prompt: "..." } => { output, raw }
 *
 * Put GEMINI_API_KEY in gemini-proxy/.env for API-key mode
 * Or set GOOGLE_APPLICATION_CREDENTIALS to a service account JSON path for SA mode.
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch'); // v2
const app = express();

app.use(express.json());

// CORS: allow your dev frontend
const allowedOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';
app.use(cors({ origin: allowedOrigin }));

const PORT = process.env.PORT || 8080;
const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const USE_SA = !!process.env.GOOGLE_APPLICATION_CREDENTIALS;

async function getAccessTokenFromSA() {
  const { GoogleAuth } = require('google-auth-library');
  const auth = new GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
  });
  const client = await auth.getClient();
  const tokenResponse = await client.getAccessToken();
  return typeof tokenResponse === 'string' ? tokenResponse : tokenResponse?.token;
}

app.get('/', (req, res) => {
  res.type('text').send(`Gemini proxy running. Mode: ${API_KEY ? 'API_KEY' : USE_SA ? 'SERVICE_ACCOUNT' : 'NO_CREDENTIALS'}. POST to /api/gemini with {"prompt":"..."} `);
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', mode: API_KEY ? 'API_KEY' : USE_SA ? 'SERVICE_ACCOUNT' : 'NO_CREDENTIALS', model: MODEL, timestamp: new Date().toISOString() });
});

app.options('/api/gemini', (req, res) => res.sendStatus(200));

app.post('/api/gemini', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Missing prompt' });

  try {
    let endpoint;
    const headers = { 'Content-Type': 'application/json' };

    // CHANGE: Gemini requires this specific body structure
    const body = { 
      contents: [{ 
        parts: [{ text: prompt }] 
      }] 
    };

    if (API_KEY) {
      // CHANGE: Updated endpoint to v1beta/models/...:generateContent
      endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
    } else if (USE_SA) {
      const accessToken = await getAccessTokenFromSA();
      if (!accessToken) return res.status(500).json({ error: 'Failed to obtain access token' });
      headers.Authorization = `Bearer ${accessToken}`;
      // CHANGE: Updated endpoint for Service Account
      endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;
    } else {
      return res.status(500).json({ error: 'No credentials configured' });
    }

    console.log(`[proxy] calling ${endpoint} (model=${MODEL})`);

    const r = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    const txt = await r.text();
    let data;
    try { data = JSON.parse(txt); } catch (e) { data = txt; }

    if (!r.ok) {
      console.error('[proxy] downstream error', r.status, data);
      return res.status(502).json({ error: data });
    }

    // CHANGE: Updated parsing logic for Gemini response structure
    let output = '';
    if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      output = data.candidates[0].content.parts[0].text;
    } else {
      // Fallback for debugging
      output = JSON.stringify(data);
    }

    res.json({ output, raw: data });
  } catch (err) {
    console.error('[proxy] unexpected error', err);
    res.status(500).json({ error: 'Proxy unexpected error', details: String(err) });
  }
});

app.listen(PORT, () => {
  console.log(`Gemini proxy running on port ${PORT}. Mode: ${API_KEY ? 'API_KEY' : USE_SA ? 'SERVICE_ACCOUNT' : 'NO_CREDENTIALS'}, CORS origin: ${allowedOrigin}`);
});

app.get('/api/weather', async (req, res) => {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Server missing OPENWEATHER_API_KEY' });

  const q = (req.query.q && String(req.query.q).trim()) || process.env.OPENWEATHER_DEFAULT_CITY || 'London';
  const units = req.query.units || 'metric'; // 'metric' returns Celsius

  const endpoint = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(q)}&units=${units}&appid=${apiKey}`;

  try {
    const r = await fetch(endpoint);
    const txt = await r.text();
    let data;
    try { data = JSON.parse(txt); } catch (e) { data = txt; }

    if (!r.ok) {
      console.error('[weather] upstream error', r.status, data);
      return res.status(502).json({ error: data });
    }

    // Normalize a small, easy-to-consume object for the frontend
    const out = {
      city: data.name,
      temp: data.main?.temp,
      feels_like: data.main?.feels_like,
      humidity: data.main?.humidity,
      weather: data.weather?.[0]?.description,
      icon: data.weather?.[0]?.icon, // OpenWeatherMap icon id (use https://openweathermap.org/img/wn/{icon}@2x.png)
      raw: data,
    };

    res.json(out);
  } catch (err) {
    console.error('[weather] unexpected error', err);
    res.status(500).json({ error: 'Weather proxy unexpected error', details: String(err) });
  }
});