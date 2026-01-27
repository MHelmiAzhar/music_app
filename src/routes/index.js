import { Router } from 'express';
import albumRouter from './album.route.js';
import songRouter from './song.route.js';
import usersRouter from './users.route.js';
import authenticationsRouter from './authentications.route.js';
import playlistsRouter from './playlists.route.js';
import collaborationsRouter from './collaborations.route.js';

const router = Router();

// Mount album routes under /albums
router.use('/albums', albumRouter);
// Mount song routes under /songs
router.use('/songs', songRouter);
// Users & Auth
router.use('/users', usersRouter);
router.use('/authentications', authenticationsRouter);
// Playlists & Collaborations
router.use('/playlists', playlistsRouter);
router.use('/collaborations', collaborationsRouter);

export default router;
