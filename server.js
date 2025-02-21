const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const User=require('./models/User');
const Course=require('./models/Course');
const Enrollment=require('./models/Enrollment');

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'))

mongoose.connect('mongodb://127.0.0.1:27017/elearning', {
}).then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

function authMiddleware(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.log("Token verification error:", err.message);
            return res.status(403).json({ message: "Invalid token" });
        }
        req.user = decoded;
        next();
    });
}

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/home.html'); // Или home.html, если нужно
});

app.post('/register', async (req, res) => {
    const { username, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ username, email, password: hashedPassword, role });
    await user.save();
    res.json({ message: 'User registered successfully' });
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,  // Используем правильный секретный ключ
        { expiresIn: "1h" }
    );

    res.json({ token });
});


// Add Course (Only Instructors)
app.post('/courses', authMiddleware, async (req, res) => {
    if (req.user.role !== 'instructor' && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Only instructors can add courses' });
    }
    const course = new Course({ ...req.body, instructorId: req.user.userId });
    await course.save();
    res.json({ message: 'Course added successfully' });
});

// Get All Courses
app.get('/courses', async (req, res) => {
    const courses = await Course.find();
    res.json(courses);
});

app.get('/enrolled',authMiddleware, async (req,res) =>{
    try {
        const userId = req.user.userId;
        console.log(req.user);
        const enrolled = await Enrollment.find({userId: userId}).populate('courseId');
        res.json(enrolled)
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

app.get('/profile', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'Unauthorized' });

        const decoded = jwt.verify(token, 'secret');
        const user = await User.findById(decoded.userId).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile' });
    }
});

// Enroll in Course
app.post('/enroll', authMiddleware, async (req, res) => {
    const { courseId } = req.body;
    const enrollment = new Enrollment({ userId: req.user.userId, courseId });
    await enrollment.save();
    res.json({ message: 'Enrolled successfully' });
});

// Track Progress
app.put('/progress', authMiddleware, async (req, res) => {
    const { courseId, progress } = req.body;
    await Enrollment.updateOne({ userId: req.user.userId, courseId }, { progress });
    res.json({ message: 'Progress updated' });
});

app.listen(5000, () => console.log('Server running on http://localhost:5000'));
      