const { Schema, model } = require('mongoose');
module.exports = model('Todo', new Schema({
  userId: { type: String, index: true },
  title: { type: String, required: true },
  done: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
}));
