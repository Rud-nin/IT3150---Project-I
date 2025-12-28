import mongoose from "mongoose";

const notificationScheme = new mongoose.Schema({
    message: {
        type: String,
        required: [true, 'Notification message is required.'],
    },
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Notification sender is required.'],
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Notification receiver is required.'],
    }
});

const Notification = mongoose.model('Notification', notificationScheme);

export default Notification;