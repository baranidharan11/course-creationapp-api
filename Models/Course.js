const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    level: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        required: true,
    },
    category: {
        type: String,
        enum: ['WebDevelopment', 'CyberSecurity', 'Data Management', 'Data Analyst', 'Data Science', 'Embedded Systems'],
        required: true,
    },
    subcategory: { type: String },
    coverImage: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Course', CourseSchema);
