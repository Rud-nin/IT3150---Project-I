import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if(!token) return res.status(401).json({ success: false, message: 'No token provided.' });
    
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded?._id) return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
    
        // guard: make sure userId is ObjectId type
        req.userId = new mongoose.Types.ObjectId(decoded._id);
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ success: false, message: 'Authentication failed.' });
    }
};

export default authMiddleware;