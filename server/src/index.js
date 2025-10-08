require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN, credentials: false }));
app.use(express.json());
app.use('/media', express.static(path.join(__dirname, '../../Music')));

app.get('/api/health', (_, res) => res.json({ ok: true }));

app.use('/api/todos', require('./routes/todos'));
app.use('/api/notes', require('./routes/notes'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/sessions', require('./routes/sessions'));

async function start() {
  await mongoose.connect(process.env.MONGODB_URI);
  const port = process.env.PORT || 5000;
  app.listen(port, () => console.log(`API on :${port}`));
}
start();
