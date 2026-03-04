import { Router } from 'express';
import authenticateToken from '../middlewares/auth.middleware.js';
import {
  createPlaylist,
  getPlaylists,
  getPlaylistById,
  getPlaylistSongs,
  getPlaylistActivities,
  updatePlaylist,
  deletePlaylist,
  addSongToPlaylist,
  deleteSongFromPlaylist,
} from '../controllers/playlists.controller.js';
import { validateBody, validateParams } from '../middlewares/validation.middleware.js';
import {
  createPlaylistSchema,
  updatePlaylistSchema,
  playlistIdParamSchema,
  addSongToPlaylistSchema,
} from '../middlewares/schemas/playlist.schema.js';

const router = Router();

router.post('/', authenticateToken, validateBody(createPlaylistSchema), createPlaylist);
router.get('/', authenticateToken, getPlaylists);
router.get('/:id', authenticateToken, validateParams(playlistIdParamSchema), getPlaylistById);
router.get('/:id/songs', authenticateToken, validateParams(playlistIdParamSchema), getPlaylistSongs);
router.get('/:id/activities', authenticateToken, validateParams(playlistIdParamSchema), getPlaylistActivities);
router.put(
  '/:id',
  authenticateToken,
  validateParams(playlistIdParamSchema),
  validateBody(updatePlaylistSchema),
  updatePlaylist
);
router.post(
  '/:id/songs',
  authenticateToken,
  validateParams(playlistIdParamSchema),
  validateBody(addSongToPlaylistSchema),
  addSongToPlaylist
);
router.delete(
  '/:id/songs',
  authenticateToken,
  validateParams(playlistIdParamSchema),
  validateBody(addSongToPlaylistSchema),
  deleteSongFromPlaylist
);
router.delete('/:id', authenticateToken, validateParams(playlistIdParamSchema), deletePlaylist);

export default router;
