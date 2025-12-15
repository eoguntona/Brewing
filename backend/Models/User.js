const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  baristaId: {
    type: String,
    default: uuidv4,
    unique: true
  },

  totalMinutesStudied: { type: Number, default: 0 },

  badges: {
    type: [String],
    default: []
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);