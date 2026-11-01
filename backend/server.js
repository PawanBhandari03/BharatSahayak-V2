require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/whatsapp', require('./routes/whatsapp'));
app.use('/api/call', require('./routes/call'));
app.use('/api', require('./routes/schemes'));

// Health checks (also used to keep a sleeping host awake)
app.get('/health', (req, res) => res.json({ ok: true }));
app.get('/api/status', (req, res) => {
  res.json({ status: 'BharatSahayak Backend running ✅', port: PORT });
});

// Serve the built website (frontend/dist) from the same server, so one URL hosts the app and the API.
const distDir = path.join(__dirname, '..', 'frontend', 'dist');
if (fs.existsSync(path.join(distDir, 'index.html'))) {
  app.use(express.static(distDir));
  app.get(/^\/(?!api\/|health).*/, (req, res) => res.sendFile(path.join(distDir, 'index.html')));
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
