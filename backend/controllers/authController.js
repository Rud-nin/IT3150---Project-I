import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/userModel.js';

export const register = async (req, res) => {
    try {
        const { username, password } = req.body;
        if(!username || !password) return res.status(400).json({ success: false, message: 'Username and password are required.' });
        if(password.length < 8) return res.status(400).json({ success: false, message: 'Password must contains at least 8 characters.' });
    
        const user = await User.findOne({ username });
        if(user) return res.status(400).json({ success: false, message: 'Username already exists.' });
    
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ username, password: hashedPassword });
    
        res.status(201).json({ success: true, message: 'User created successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if(!username || !password) return res.status(400).json({ success: false, message: 'Username and password are required.' });
        
        const user = await User.findOne({ username });
        if(!user) return res.status(400).json({ success: false, message: 'Invalid username or password.' });
        
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid) return res.status(400).json({ success: false, message: 'Invalid username or password.' });
    
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
        res.status(200).json({ success: true, message: 'User logged in successfully.', user: { _id: user._id, username: user.username }, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};

export const logout = async (req, res) => {
    try {
        res.cookie('token', '', { maxAge: 0 });
        res.status(200).json({ success: true, message: 'User logged out successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};

export const check = (req, res) => {
    res.status(200).json({ success: true, message: "Valid user." });
}