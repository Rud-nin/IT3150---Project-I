import express from 'express';
import { getUsersByName } from '../controllers/userController.js';

const router = express.Router();

router.get('/:name', getUsersByName);

export default router;