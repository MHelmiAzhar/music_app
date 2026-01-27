import pool from '../utils/db.js';
import { nanoid } from 'nanoid';
import NotFoundError from '../exceptions/NotFoundError.js';
import AuthorizationError from '../exceptions/AuthorizationError.js';
import InvariantError from '../exceptions/InvariantError.js';

const verifyPlaylistOwner = async (playlistId, userId) => {
  const result = await pool.query('SELECT owner FROM playlists WHERE id = $1', [playlistId]);
  if (result.rowCount === 0) throw new NotFoundError('Playlist not found');
  if (result.rows[0].owner !== userId) throw new AuthorizationError('You do not have access to this resource');
};

const verifyPlaylistAccess = async (playlistId, userId) => {
  const result = await pool.query('SELECT owner FROM playlists WHERE id = $1', [playlistId]);
  if (result.rowCount === 0) throw new NotFoundError('Playlist not found');
  if (result.rows[0].owner === userId) return;

  const collab = await pool.query(
    'SELECT id FROM collaborators WHERE "playlistId" = $1 AND "userId" = $2',
    [playlistId, userId]
  );
  if (collab.rowCount === 0) throw new AuthorizationError('You do not have access to this resource');
};

export const createPlaylist = async (req, res, next) => {
  try {
    const { name } = req.body;
    const owner = req.auth.id;
    const playlistId = `playlist-${nanoid(16)}`;

    const result = await pool.query(
      'INSERT INTO playlists(id, name, owner) VALUES($1, $2, $3) RETURNING id',
      [playlistId, name, owner]
    );

    res.status(201).json({ status: 'success', data: { playlistId: result.rows[0].id } });
  } catch (err) {
    next(err);
  }
};

export const getPlaylists = async (req, res, next) => {
  try {
    const userId = req.auth.id;

    const result = await pool.query(
      `SELECT playlists.id, playlists.name, users.username
       FROM playlists
       LEFT JOIN users ON playlists.owner = users.id
       WHERE playlists.owner = $1
          OR playlists.id IN (
            SELECT "playlistId" FROM collaborators WHERE "userId" = $1
          )
       ORDER BY playlists."createdAt" DESC`,
      [userId]
    );

    res.json({ status: 'success', data: { playlists: result.rows } });
  } catch (err) {
    next(err);
  }
};

export const getPlaylistById = async (req, res, next) => {
  try {
    const { id } = req.validatedParams ?? req.params;
    const userId = req.auth.id;

    await verifyPlaylistAccess(id, userId);

    const result = await pool.query(
      `SELECT playlists.id, playlists.name, users.username
       FROM playlists
       LEFT JOIN users ON playlists.owner = users.id
       WHERE playlists.id = $1`,
      [id]
    );

    res.json({ status: 'success', data: { playlist: result.rows[0] } });
  } catch (err) {
    next(err);
  }
};

export const getPlaylistSongs = async (req, res, next) => {
  try {
    const { id } = req.validatedParams ?? req.params;
    const userId = req.auth.id;

    await verifyPlaylistAccess(id, userId);

    const playlistResult = await pool.query(
      `SELECT playlists.id, playlists.name, users.username
       FROM playlists
       LEFT JOIN users ON playlists.owner = users.id
       WHERE playlists.id = $1`,
      [id]
    );

    if (playlistResult.rowCount === 0) throw new NotFoundError('Playlist not found');

    const songsResult = await pool.query(
      `SELECT songs.id, songs.title, songs.performer
       FROM playlist_songs
       LEFT JOIN songs ON playlist_songs."songId" = songs.id
       WHERE playlist_songs."playlistId" = $1
       ORDER BY playlist_songs."createdAt" DESC`,
      [id]
    );

    const playlist = { ...playlistResult.rows[0], songs: songsResult.rows };
    res.json({ status: 'success', data: { playlist } });
  } catch (err) {
    next(err);
  }
};

export const updatePlaylist = async (req, res, next) => {
  try {
    const { id } = req.validatedParams ?? req.params;
    const { name } = req.body;
    const userId = req.auth.id;

    await verifyPlaylistAccess(id, userId);

    const result = await pool.query(
      'UPDATE playlists SET name = $1, "updatedAt" = NOW() WHERE id = $2 RETURNING id',
      [name, id]
    );

    if (result.rowCount === 0) throw new NotFoundError('Playlist not found');
    res.json({ status: 'success', message: 'Playlist updated' });
  } catch (err) {
    next(err);
  }
};

export const addSongToPlaylist = async (req, res, next) => {
  try {
    const { id: playlistId } = req.validatedParams ?? req.params;
    const { songId } = req.body;
    const userId = req.auth.id;

    await verifyPlaylistAccess(playlistId, userId);

    const songResult = await pool.query('SELECT id FROM songs WHERE id = $1', [songId]);
    if (songResult.rowCount === 0) throw new NotFoundError('Song not found');

    const playlistSongId = `playlist-song-${nanoid(16)}`;
    await pool.query(
      'INSERT INTO playlist_songs(id, "playlistId", "songId") VALUES($1, $2, $3)',
      [playlistSongId, playlistId, songId]
    );

    const activityId = `activity-${nanoid(16)}`;
    await pool.query(
      'INSERT INTO playlist_activities(id, "playlistId", "songId", "userId", action) VALUES($1, $2, $3, $4, $5)',
      [activityId, playlistId, songId, userId, 'add']
    );

    res.status(201).json({ status: 'success', message: 'Song added to playlist' });
  } catch (err) {
    if (err.code === '23505') return next(new InvariantError('Song already exists in playlist'));
    if (err.code === '23503') return next(new NotFoundError('Playlist or song not found'));
    next(err);
  }
};

export const deleteSongFromPlaylist = async (req, res, next) => {
  try {
    const { id: playlistId } = req.validatedParams ?? req.params;
    const { songId } = req.body;
    const userId = req.auth.id;

    await verifyPlaylistAccess(playlistId, userId);

    const result = await pool.query(
      'DELETE FROM playlist_songs WHERE "playlistId" = $1 AND "songId" = $2',
      [playlistId, songId]
    );

    if (result.rowCount === 0) throw new NotFoundError('Song not found in playlist');

    const activityId = `activity-${nanoid(16)}`;
    await pool.query(
      'INSERT INTO playlist_activities(id, "playlistId", "songId", "userId", action) VALUES($1, $2, $3, $4, $5)',
      [activityId, playlistId, songId, userId, 'delete']
    );

    res.json({ status: 'success', message: 'Song removed from playlist' });
  } catch (err) {
    next(err);
  }
};

export const getPlaylistActivities = async (req, res, next) => {
  try {
    const { id: playlistId } = req.validatedParams ?? req.params;
    const userId = req.auth.id;

    await verifyPlaylistAccess(playlistId, userId);

    const result = await pool.query(
      `SELECT users.username, songs.title, playlist_activities.action, playlist_activities.time
       FROM playlist_activities
       LEFT JOIN users ON playlist_activities."userId" = users.id
       LEFT JOIN songs ON playlist_activities."songId" = songs.id
       WHERE playlist_activities."playlistId" = $1
       ORDER BY playlist_activities.time ASC`,
      [playlistId]
    );

    res.json({
      status: 'success',
      data: {
        playlistId,
        activities: result.rows,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const deletePlaylist = async (req, res, next) => {
  try {
    const { id } = req.validatedParams ?? req.params;
    const userId = req.auth.id;

    await verifyPlaylistOwner(id, userId);

    const result = await pool.query('DELETE FROM playlists WHERE id = $1', [id]);
    if (result.rowCount === 0) throw new NotFoundError('Playlist not found');
    res.json({ status: 'success', message: 'Playlist deleted' });
  } catch (err) {
    next(err);
  }
};
