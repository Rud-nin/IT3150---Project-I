import express from 'express';
import {
    createProject,
    getProjects,
    deleteProject,
    addParticipant,
    removeParticipant
} from '../controllers/projectController.js';

const router = express.Router();

router.get('/', getProjects);
router.post('/', createProject);
router.delete('/:projectId', deleteProject);
router.post('/:projectId/participants', addParticipant);
router.delete('/:projectId/participants', removeParticipant);

export default router;