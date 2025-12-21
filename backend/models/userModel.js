import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required.'],
        unique: [true, 'Username already exists.'],
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required.'],
        minlength: [8, 'Password must contains at least 8 characters.']
    }
});

const User = mongoose.model('User', userSchema);

export default User;