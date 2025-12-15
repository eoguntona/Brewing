/*const mongoose = require('mongoose');
const { v4: uuidv14 } = require('uuid');

const UserSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: { 
    type: String, 
    required: true,
    minlength: 6
  },
  baristaId: {
    type: String,
    default: uuidv4,
    unique: true
  },
  totalMinutesStudied: { 
    type: Number, 
    default: 0 
  },
  badges: {
    type: [String],
    default: []
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema); */

const mongoose = require('mongoose');

// Generate a short, simple random ID
function generateBaristaId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = '';
  for (let i = 0; i < 8; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id; // Format: A3B7K2M9
}

const UserSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: { 
    type: String, 
    required: true,
    minlength: 6
  },
  baristaId: {
    type: String,
    default: generateBaristaId,
    unique: true
  },
  totalMinutesStudied: { 
    type: Number, 
    default: 0 
  },
  badges: {
    type: [String],
    default: []
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);