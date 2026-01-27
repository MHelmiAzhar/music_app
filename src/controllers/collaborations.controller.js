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

export const addCollaborator = async (req, res, next) => {
  try {
    const { playlistId, userId } = req.body;
    const ownerId = req.auth.id;

    await verifyPlaylistOwner(playlistId, ownerId);

    const userResult = await pool.query('SELECT id FROM users WHERE id = $1', [userId]);
    if (userResult.rowCount === 0) throw new NotFoundError('User not found');

    const existing = await pool.query(
      'SELECT id FROM collaborators WHERE "playlistId" = $1 AND "userId" = $2',
      [playlistId, userId]
    );
    if (existing.rowCount > 0) throw new InvariantError('Collaborator already exists');

    const collaboratorId = `collab-${nanoid(16)}`;
    await pool.query(
      'INSERT INTO collaborators(id, "playlistId", "userId") VALUES($1, $2, $3)',
      [collaboratorId, playlistId, userId]
    );

    res.status(201).json({ status: 'success', data: { collaborationId: collaboratorId } });
  } catch (err) {
    next(err);
  }
};

export const removeCollaborator = async (req, res, next) => {
  try {
    const { playlistId, userId } = req.body;
    const ownerId = req.auth.id;

    await verifyPlaylistOwner(playlistId, ownerId);

    const result = await pool.query(
      'DELETE FROM collaborators WHERE "playlistId" = $1 AND "userId" = $2',
      [playlistId, userId]
    );

    if (result.rowCount === 0) throw new NotFoundError('Collaborator not found');
    res.json({ status: 'success', message: 'Collaborator removed' });
  } catch (err) {
    next(err);
  }
};
