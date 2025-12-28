import User from '../models/userModel.js';

export const getUsersByName = async (req, res) => {
    try {
        const { name = "" } = req.query;
        const users = await User.find({ username: { $regex: name, $options: 'i' } }).select('-password');
        res.status(200).json({ success: true, message: 'Users fetched successfully.', users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};