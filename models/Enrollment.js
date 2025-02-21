// Enrollment Schema
const mongoose = require("mongoose");

const EnrollmentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    progress: { type: Number, default: 0 },
    completed: { type: Boolean, default: false }
});

module.exports = mongoose.model('Enrollment', EnrollmentSchema);