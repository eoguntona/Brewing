const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
},

participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
}],

durationMinutes: {
    type: Number,
    required: true
},

isActive: {
    type: Boolean,
    default: true
}
}, { timestamps: true });

module.exports = mongoose.model('Session', SessionSchema);
