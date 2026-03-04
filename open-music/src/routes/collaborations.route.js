import { Router } from 'express';
import authenticateToken from '../middlewares/auth.middleware.js';
import { addCollaborator, removeCollaborator } from '../controllers/collaborations.controller.js';
import { validateBody } from '../middlewares/validation.middleware.js';
import { collaborationSchema } from '../middlewares/schemas/collaboration.schema.js';

const router = Router();

router.post('/', authenticateToken, validateBody(collaborationSchema), addCollaborator);
router.delete('/', authenticateToken, validateBody(collaborationSchema), removeCollaborator);

export default router;
