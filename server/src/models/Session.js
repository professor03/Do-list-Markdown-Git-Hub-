const { Schema, model } = require('mongoose');
module.exports = model('Session', new Schema({
  userId: { type: String, index: true },
  todoId: { type: Schema.Types.ObjectId, ref: 'Todo' },
  phase: { type: String, enum: ['focus', 'break'], required: true },
  durationSec: { type: Number, required: true },
  startedAt: { type: Date, required: true },
  endedAt: { type: Date, required: true }
}));
