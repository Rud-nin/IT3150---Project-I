import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';

dotenv.config({ quiet: true });
const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

import authRoutes from './routes/authRoutes.js';
app.use('/api/auth', authRoutes);

import authMiddleware from './middlewares/authMiddleware.js';
app.use(authMiddleware);

import projectRoutes from './routes/projectRoute.js';
app.use('/api/projects', projectRoutes);

import taskRoutes from './routes/taskRoute.js';
app.use('/api/tasks', taskRoutes);

const PORT = process.env.PORT || 3001;
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server running on port at: http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    });
