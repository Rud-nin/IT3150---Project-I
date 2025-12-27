import express from 'express';
import {
    createProject,
    getProjects,
    getProjectById,
    deleteProject,
    addParticipant,
    removeParticipant
} from '../controllers/projectController.js';

const router = express.Router();

router.post('/', createProject);
router.get('/', getProjects);
router.get('/:projectId', getProjectById);
router.delete('/:projectId', deleteProject);
router.post('/:projectId/participants', addParticipant);
router.delete('/:projectId/participants', removeParticipant);

export default router;