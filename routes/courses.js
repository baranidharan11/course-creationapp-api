const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // your auth middleware
const Course = require('../Models/Course'); // mongoose model

router.post('/add', auth, async (req, res) => {
    try {
        const { title, description, level, category, subcategory, coverImage } = req.body;

        const existing = await Course.findOne({ title });
        if (existing) return res.status(400).json({ error: 'Course already exists' });

        const course = new Course({
            title,
            description,
            level,
            category,
            subcategory,
            coverImage,
            createdBy: req.user.id
        });

        await course.save();
        res.status(201).json({ message: 'Course created', course });
    } catch (err) {
        res.status(500).json({ error: 'Server error', message: err.message });
    }
});

// Get all courses
router.get('/', auth, async (req, res) => {
    try {
        const courses = await Course.find().populate('createdBy', 'name email');
        res.json(courses);
    } catch (err) {
        res.status(500).json({ error: 'Server error', message: err.message });
    }
});

module.exports = router;
