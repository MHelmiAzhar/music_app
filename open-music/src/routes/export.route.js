import { Router } from 'express';
import authenticateToken from '../middlewares/auth.middleware.js';
import { validateBody, validateParams } from '../middlewares/validation.middleware.js';
import { exportPlaylist } from '../controllers/export.controller.js';
import {
  exportPlaylistParamSchema,
  exportPlaylistBodySchema,
} from '../middlewares/schemas/export.schema.js';

const router = Router();

router.post(
  '/playlists/:playlistId',
  authenticateToken,
  validateParams(exportPlaylistParamSchema),
  validateBody(exportPlaylistBodySchema),
  exportPlaylist
);

export default router;
