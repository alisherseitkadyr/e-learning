// User Schema
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    role: { type: String, enum: ['student', 'instructor', 'admin'], default: 'student' }
});
module.exports = mongoose.model('User',UserSchema);