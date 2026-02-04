import pool from '../utils/db.js';

export const insertAlbum = async ({ id, name, year }) => {
  const result = await pool.query(
    'INSERT INTO albums(id, name, year) VALUES($1, $2, $3) RETURNING id, name, year',
    [id, name, year]
  );
  return result.rows[0];
};

export const selectAlbums = async () => {
  const result = await pool.query('SELECT id, name, year FROM albums ORDER BY "createdAt" DESC');
  return result.rows;
};

export const selectAlbumById = async (id) => {
  const result = await pool.query('SELECT id, name, year FROM albums WHERE id = $1', [id]);
  return result.rows[0] ?? null;
};

export const selectAlbumSongs = async (albumId) => {
  const result = await pool.query(
    'SELECT id, title FROM songs WHERE "albumId" = $1 ORDER BY "createdAt" DESC',
    [albumId]
  );
  return result.rows;
};

export const updateAlbumById = async ({ id, name, year }) => {
  const result = await pool.query(
    'UPDATE albums SET name = $1, year = $2, "updatedAt" = NOW() WHERE id = $3 RETURNING id, name, year',
    [name, year, id]
  );
  return result.rowCount;
};

export const deleteAlbumById = async (id) => {
  const result = await pool.query('DELETE FROM albums WHERE id = $1', [id]);
  return result.rowCount;
};
