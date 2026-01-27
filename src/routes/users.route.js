import { Router } from 'express';
import { createUser } from '../controllers/users.controller.js';
import { validateBody } from '../middlewares/validation.middleware.js';
import { createUserSchema } from '../middlewares/schemas/user.schema.js';

const router = Router();

router.post('/', validateBody(createUserSchema), createUser);

export default router;
