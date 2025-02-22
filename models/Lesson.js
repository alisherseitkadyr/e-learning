const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course', // Reference to the Course model
        required: true,
        index:true
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
            correctAnswer: Number
        }
    ]
});

module.exports = mongoose.model('Lesson', LessonSchema);
