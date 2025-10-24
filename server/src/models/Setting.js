const { Schema, model } = require('mongoose');
module.exports = model('Setting', new Schema({
  userId: { type: String, unique: true },
  focusLength: { type: Number, default: 25*60 },
  breakLength: { type: Number, default: 5*60 }
}));
