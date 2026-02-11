import { Router } from 'express';
import {
  createAlbum,
  getAlbums,
  getAlbumById,
  updateAlbum,
  uploadAlbumCover,
  deleteAlbum,
  likeAlbum,
  unlikeAlbum,
  getAlbumLikes,
} from '../controllers/albums.controller.js';
import { validateBody, validateParams } from '../middlewares/validation.middleware.js';
import { createAlbumSchema, updateAlbumSchema, albumIdParamSchema } from '../middlewares/schemas/album.schema.js';
import uploadCover from '../middlewares/upload.middleware.js';
import authenticateToken from '../middlewares/auth.middleware.js';

const router = Router();

// CRUD Albums
router.get('/', getAlbums);
router.post('/', validateBody(createAlbumSchema), createAlbum);
router.get('/:id', validateParams(albumIdParamSchema), getAlbumById);
router.post('/:id/covers', validateParams(albumIdParamSchema), uploadCover, uploadAlbumCover);
router.post('/:id/likes', authenticateToken, validateParams(albumIdParamSchema), likeAlbum);
router.delete('/:id/likes', authenticateToken, validateParams(albumIdParamSchema), unlikeAlbum);
router.get('/:id/likes', validateParams(albumIdParamSchema), getAlbumLikes);
router.put('/:id', validateParams(albumIdParamSchema), validateBody(updateAlbumSchema), updateAlbum);
router.delete('/:id', validateParams(albumIdParamSchema), deleteAlbum);

export default router;