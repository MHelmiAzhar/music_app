import pool from '../utils/db.js';

export const findCollaborator = async ({ playlistId, userId }) => {
  const result = await pool.query(
    'SELECT id FROM collaborators WHERE "playlistId" = $1 AND "userId" = $2',
    [playlistId, userId]
  );
  return result.rows[0] ?? null;
};

export const insertCollaborator = async ({ id, playlistId, userId }) => {
  await pool.query(
    'INSERT INTO collaborators(id, "playlistId", "userId") VALUES($1, $2, $3)',
    [id, playlistId, userId]
  );
};

export const deleteCollaborator = async ({ playlistId, userId }) => {
  const result = await pool.query(
    'DELETE FROM collaborators WHERE "playlistId" = $1 AND "userId" = $2',
    [playlistId, userId]
  );
  return result.rowCount;
};
