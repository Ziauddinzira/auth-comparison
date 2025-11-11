const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String },
    provider: { type: String, default: 'local' },
    googleId: { type: String },
    createdAt: { type: Date, default: Date.now },
});


module.exports = mongoose.models.User || mongoose.model('User', UserSchema);