import { Router } from 'express';
import {
  createAlbum,
  getAlbums,
  getAlbumById,
  updateAlbum,
  deleteAlbum,
} from '../controllers/albums.controller.js';
import { validateBody, validateParams } from '../middlewares/validation.middleware.js';
import { createAlbumSchema, updateAlbumSchema, albumIdParamSchema } from '../middlewares/schemas/album.schema.js';

const router = Router();

// CRUD Albums
router.get('/', getAlbums);
router.post('/', validateBody(createAlbumSchema), createAlbum);
router.get('/:id', validateParams(albumIdParamSchema), getAlbumById);
router.put('/:id', validateParams(albumIdParamSchema), validateBody(updateAlbumSchema), updateAlbum);
router.delete('/:id', validateParams(albumIdParamSchema), deleteAlbum);

export default router;