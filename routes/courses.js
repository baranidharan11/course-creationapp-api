const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Course = require('../Models/Course');

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

// Update course by ID
router.put('/:id', auth, async (req, res) => {
    try {
        const { title, description, level, category, subcategory, coverImage } = req.body;
        
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }
        
        // Check if user is the creator of the course
        if (course.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized to update this course' });
        }
        
        
        course.title = title || course.title;
        course.description = description || course.description;
        course.level = level || course.level;
        course.category = category || course.category;
        course.subcategory = subcategory || course.subcategory;
        course.coverImage = coverImage || course.coverImage;
        course.updatedAt = Date.now();
        
        await course.save();
        
        const updatedCourse = await Course.findById(course._id).populate('createdBy', 'name email');
        res.json(updatedCourse);
    } catch (err) {
        res.status(500).json({ error: 'Server error', message: err.message });
    }
});


router.delete('/:id', auth, async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }
        
        // Check if user is the creator of the course
        if (course.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized to delete this course' });
        }
        
        await Course.findByIdAndDelete(req.params.id);
        res.json({ message: 'Course deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Server error', message: err.message });
    }
});

module.exports = router;