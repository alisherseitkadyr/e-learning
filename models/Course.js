// Course Schema
const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
    title: String,
    description: String,
    category: String,
    price: Number,
    rating: Number,
    instructorId: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
    modules: [
        {
            title: String,
            content: String,
            video_url: String
        }
    ]
});

module.exports = mongoose.model('Course', CourseSchema);