import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';
import authMiddleware from './middlewares/authMiddleware.js';
import notification from './routes/notificationRoutes.js';
import projectRoutes from './routes/projectRoute.js';
import taskRoutes from './routes/taskRoute.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config({ quiet: true });
const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use(authMiddleware);

app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/notifications', notification);
app.use('/api/users', userRoutes);

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
