import { Router } from 'express';
import {
  createSong,
  getSongs,
  getSongById,
  updateSong,
  deleteSong,
} from '../controllers/songs.controller.js';
import { validateBody, validateParams, validateQuery } from '../middlewares/validation.middleware.js';
import { createSongSchema, updateSongSchema, songIdParamSchema, songQuerySchema } from '../middlewares/schemas/song.schema.js';

const router = Router();

router.get('/', validateQuery(songQuerySchema), getSongs);
router.post('/', validateBody(createSongSchema), createSong);
router.get('/:id', validateParams(songIdParamSchema), getSongById);
router.put('/:id', validateParams(songIdParamSchema), validateBody(updateSongSchema), updateSong);
router.delete('/:id', validateParams(songIdParamSchema), deleteSong);

export default router;