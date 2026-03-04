import { Router } from 'express';
import {
  postAuthentication,
  putAuthentication,
  deleteAuthentication,
} from '../controllers/authentications.controller.js';
import { validateBody } from '../middlewares/validation.middleware.js';
import {
  createAuthenticationSchema,
  refreshAuthenticationSchema,
} from '../middlewares/schemas/authentication.schema.js';

const router = Router();

router.post('/', validateBody(createAuthenticationSchema), postAuthentication);
router.put('/', validateBody(refreshAuthenticationSchema), putAuthentication);
router.delete('/', validateBody(refreshAuthenticationSchema), deleteAuthentication);

export default router;
