import pool from '../utils/db.js';
import NotFoundError from '../exceptions/NotFoundError.js';
import { nanoid } from 'nanoid';

export const createSong = async (req, res, next) => {
  try {
    const songId = nanoid(16);
    const { title, year, genre, performer, duration = null, albumId = null } = req.body;

    const result = await pool.query(
      'INSERT INTO songs(id, title, year, genre, performer, duration, "albumId") VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id, title, year, genre, performer, duration, "albumId"',
      [songId, title, year, genre, performer, duration, albumId]
    );

    const song = result.rows[0];
    res.status(201).json({ status: 'success', data: { songId: song.id } });
  } catch (err) {
    // Foreign key violation
    if (err.code === '23503') return next(new NotFoundError('Album not found'));
    next(err);
  }
};

export const getSongs = async (req, res, next) => {
  try {
    const { title, performer } = req.validatedQuery ?? req.query;

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
    res.json({ status: 'success', data: { songs: result.rows } });
  } catch (err) {
    next(err);
  }
};

export const getSongById = async (req, res, next) => {
  try {
    const { id } = req.validatedParams ?? req.params;
    const result = await pool.query(
      'SELECT id, title, year, genre, performer, duration, "albumId" FROM songs WHERE id = $1',
      [id]
    );
    if (result.rowCount === 0) throw new NotFoundError('Song not found');
    res.json({ status: 'success', data: { song: result.rows[0] } });
  } catch (err) {
    next(err);
  }
};

export const updateSong = async (req, res, next) => {
  try {
    const { id } = req.validatedParams ?? req.params;
    const { title, year, genre, performer, duration = null, albumId = null } = req.body;

    const result = await pool.query(
      'UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, "albumId" = $6, "updatedAt" = NOW() WHERE id = $7 RETURNING id',
      [title, year, genre, performer, duration, albumId, id]
    );
    if (result.rowCount === 0) throw new NotFoundError('Song not found');
    res.json({ status: 'success', message: 'Song updated' });
  } catch (err) {
    if (err.code === '23503') return next(new NotFoundError('Album not found'));
    next(err);
  }
};

export const deleteSong = async (req, res, next) => {
  try {
    const { id } = req.validatedParams ?? req.params;
    const result = await pool.query('DELETE FROM songs WHERE id = $1', [id]);
    if (result.rowCount === 0) throw new NotFoundError('Song not found');
    res.status(200).json({ status: 'success', message: 'Song deleted' });
  } catch (err) {
    next(err);
  }
};