import express from 'express';
import { getNotifications, deleteNotification } from '../controllers/notificationController.js';

const router = express.Router();

router.get('/', getNotifications);
router.delete('/:notificationId', deleteNotification);

export default router;