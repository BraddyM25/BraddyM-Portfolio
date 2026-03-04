const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const DB = path.join(__dirname, 'contacts.json');

app.use(express.json());
app.use(express.static(__dirname));
function readDB() {
  if (!fs.existsSync(DB)) return [];
  try { return JSON.parse(fs.readFileSync(DB, 'utf8')); } catch (_) { return []; }
}
function writeDB(d) { fs.writeFileSync(DB, JSON.stringify(d, null, 2)); }

app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body || {};
  if (!name || !email || !message) return res.status(400).json({ error: 'Missing fields' });
  const all = readDB();
  all.push({ name, email, message, timestamp: new Date().toISOString() });
  writeDB(all);
  res.json({ ok: true });
});

app.get('/api/contacts', (req, res) => res.json(readDB()));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✓ Server running on port ${PORT}`));
