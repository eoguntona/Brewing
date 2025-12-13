const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');



//!!SCHEMAS!!

//USER SCHEMA
const UserSchema = new mongoose.Schema({
username: { type: String, required: true, unique: true},

password: { type: String, required: true},

baristaId: {type: String, default: uuidv4, /* THIS is the ID users share with friends */ unique: true},

totalMinutesStudied: { type: Number,default: 0},

badges: { type: [String], /*['espresso', 'latte', 'cappuccino']*/ default: []}
}, { timestamps: true });


//SESSION SCHEMA
const SessionSchema = new mongoose.Schema({
host: { type: mongoose.Schema.Types.ObjectId, required: true},

participants: [{type: mongoose.Schema.Types.ObjectId,}],

durationMinutes: Number,

isActive: { type: Boolean,default: true},

startedAt: { type: Date, default: Date.now}
});
module.exports = mongoose.model('Session', SessionSchema);

