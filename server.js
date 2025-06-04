const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const coursesRoutes = require('./routes/courses');

dotenv.config();

const app = express();


const corsOptions = {
    origin: 'http://localhost:3001',
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.json({ limit: '10mb' }));

const password = encodeURIComponent(process.env.MONGO_PASSWORD);
mongoose.connect(
    `mongodb+srv://baraniskt11:${password}@cluster0.lfn32se.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/courses', coursesRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server Started at ${PORT}`);
});
