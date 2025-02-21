const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course', // Reference to the Course model
        required: true
    },
    title: String,
    description: String,
    category: String,
    videoUrl: String,
    content: String, // Text-based information
    quiz: [
        {
            question: String,
            options: [String],
            correctAnswer: String
        }
    ]
});

module.exports = mongoose.model('Lesson', LessonSchema);
