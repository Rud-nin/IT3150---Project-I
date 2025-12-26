import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const authMiddleware = async (req, res, next) => {
    const token = req.cookies?.token;
    if(!token) return res.status(401).json({ sucess: false, message: 'No token provided.' });

    const userId = jwt.verify(token, process.env.JWT_SECRET);
    if(!userId) return res.status(401).json({ sucess: false, message: 'Invalid or expired token.' });

    // guard: make sure userId is ObjectId type
    req.userId = new mongoose.Types.ObjectId(userId);
    next();
};

export default authMiddleware;