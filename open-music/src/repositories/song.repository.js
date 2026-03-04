import pool from '../utils/db.js';

export const insertSong = async ({
  id,
  title,
  year,
  genre,
  performer,
  duration = null,
  albumId = null,
}) => {
  const result = await pool.query(
    'INSERT INTO songs(id, title, year, genre, performer, duration, "albumId") VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id, title, year, genre, performer, duration, "albumId"',
    [id, title, year, genre, performer, duration, albumId]
  );
  return result.rows[0];
};

export const selectSongs = async ({ title, performer }) => {
  const conditions = [];
  const values = [];
  if (title) {
    values.push(`%${title}%`);
    conditions.push(`title ILIKE $${values.length}`);
  }
  if (performer) {
    values.push(`%${performer}%`);
    conditions.push(`performer ILIKE $${values.length}`);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const query = `SELECT id, title, performer FROM songs ${whereClause} ORDER BY "createdAt" DESC`;
  const result = await pool.query(query, values);
  return result.rows;
};

export const selectSongById = async (id) => {
  const result = await pool.query(
    'SELECT id, title, year, genre, performer, duration, "albumId" FROM songs WHERE id = $1',
    [id]
  );
  return result.rows[0] ?? null;
};

export const updateSongById = async ({
  id,
  title,
  year,
  genre,
  performer,
  duration = null,
  albumId = null,
}) => {
  const result = await pool.query(
    'UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, "albumId" = $6, "updatedAt" = NOW() WHERE id = $7 RETURNING id',
    [title, year, genre, performer, duration, albumId, id]
  );
  return result.rowCount;
};

export const deleteSongById = async (id) => {
  const result = await pool.query('DELETE FROM songs WHERE id = $1', [id]);
  return result.rowCount;
};

export const selectSongExists = async (id) => {
  const result = await pool.query('SELECT id FROM songs WHERE id = $1', [id]);
  return result.rowCount > 0;
};
