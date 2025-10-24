const { Schema, model } = require('mongoose');
module.exports = model('Note', new Schema({
  userId: { type: String, index: true },
  title: { type: String, default: 'Untitled' },
  markdown: { type: String, default: '' },
  updatedAt: { type: Date, default: Date.now }
}));
