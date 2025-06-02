import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const CourseForm = () => {
    const { user, token } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        level: 'Beginner',
        category: 'WebDevelopment',
        subcategory: '',
        coverImage: ''
    });

    const [showSnackbar, setShowSnackbar] = useState(false);

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === 'coverImage' && files && files.length > 0) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData((prev) => ({
                    ...prev,
                    coverImage: reader.result // Base64 string
                }));
            };
            reader.readAsDataURL(files[0]);
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch('http://localhost:3000/api/courses/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to create course');

            setShowSnackbar(true);

            setFormData({
                title: '',
                description: '',
                level: 'Beginner',
                category: 'WebDevelopment',
                subcategory: '',
                coverImage: ''
            });

            setTimeout(() => setShowSnackbar(false), 3000);
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center p-6">
            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-lg rounded-xl p-8 w-full max-w-xl"
            >
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                    Create Course
                </h2>

                <p className="text-sm text-gray-500 mb-4">
                    Logged in as: <strong>{user?.name}</strong> ({user?.email})
                </p>

                <input
                    name="title"
                    type="text"
                    placeholder="Course Title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full mb-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                />

                <textarea
                    name="description"
                    placeholder="Description"
                    required
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full mb-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                />

                <select
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                    required
                    className="w-full mb-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                </select>

                <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full mb-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                >
                    <option>WebDevelopment</option>
                    <option>CyberSecurity</option>
                    <option>Data Management</option>
                    <option>Data Analyst</option>
                    <option>Data Science</option>
                    <option>Embedded Systems</option>
                </select>

                <input
                    name="subcategory"
                    type="text"
                    placeholder="Subcategory"
                    value={formData.subcategory}
                    onChange={handleChange}
                    className="w-full mb-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                />

                <input
                    name="coverImage"
                    type="file"
                    accept="image/*"
                    onChange={handleChange}
                    className="w-full mb-6 px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                />

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    Create Course
                </button>
            </form>

            {showSnackbar && (
                <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg transition-all">
                    🎉 Course created successfully!
                </div>
            )}
        </div>
    );
};

export default CourseForm;
