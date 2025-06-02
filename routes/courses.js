const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Course = require('../Models/Course');

// Add course
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


router.get('/:id', auth, async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).populate('createdBy', 'name email');
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }
        res.json(course);
    } catch (err) {
        res.status(500).json({ error: 'Server error', message: err.message });
    }
});

module.exports = router;