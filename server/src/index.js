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

let memoryServer;

async function connectToDatabase() {
  const uri = process.env.MONGODB_URI;

  if (uri) {
    try {
      await mongoose.connect(uri);
      console.log('Connected to MongoDB using MONGODB_URI');
      return;
    } catch (error) {
      console.warn('Failed to connect using MONGODB_URI:', error.message);
    }
  }

  const { MongoMemoryServer } = require('mongodb-memory-server');
  memoryServer = await MongoMemoryServer.create();
  const fallbackUri = memoryServer.getUri('pomodoro');
  await mongoose.connect(fallbackUri);
  console.log('Connected to in-memory MongoDB fallback instance');
}

async function start() {
  await connectToDatabase();
  const port = process.env.PORT || 5000;
  app.listen(port, () => console.log(`API on :${port}`));
}

async function shutdown() {
  await mongoose.connection.close().catch(() => {});
  if (memoryServer) {
    await memoryServer.stop().catch(() => {});
  }
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

start();
