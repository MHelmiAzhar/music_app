import pool from '../utils/db.js';
import NotFoundError from '../exceptions/NotFoundError.js';
import { nanoid } from 'nanoid';

export const createAlbum = async (req, res, next) => {
  try {
    const albumId = nanoid(16);
    const { name, year } = req.body;

    const result = await pool.query(
      'INSERT INTO albums(id, name, year) VALUES($1, $2, $3) RETURNING id, name, year',
      [albumId, name, year]
    );

    res.status(201).json({ status: 'success', data:{ albumId: result.rows[0].id } });
  } catch (err) {
    next(err);
  }
};

export const getAlbums = async (_req, res, next) => {
  try {
    const result = await pool.query('SELECT id, name, year FROM albums ORDER BY "createdAt" DESC');
    res.json({ status: 'success', data: { albums: result.rows } });
  } catch (err) {
    next(err);
  }
};

export const getAlbumById = async (req, res, next) => {
  try {
    const { id } = req.validatedParams ?? req.params;
    const result = await pool.query('SELECT id, name, year FROM albums WHERE id = $1', [id]);
    if (result.rowCount === 0) throw new NotFoundError('Album not found');

    const songsRes = await pool.query(
      'SELECT id, title FROM songs WHERE "albumId" = $1 ORDER BY "createdAt" DESC',
      [id]
    );

    const album = { ...result.rows[0], songs: songsRes.rows };
    res.json({ status: 'success', data: { album } });
  } catch (err) {
    next(err);
  }
};

export const updateAlbum = async (req, res, next) => {
  try {
    const { id } = req.validatedParams ?? req.params;
    const { name, year } = req.body;

    const result = await pool.query(
      'UPDATE albums SET name = $1, year = $2, "updatedAt" = NOW() WHERE id = $3 RETURNING id, name, year',
      [name, year, id]
    );
    if (result.rowCount === 0) throw new NotFoundError('Album not found');
    res.json({ status: 'success', message: 'Album updated' });
  } catch (err) {
    next(err);
  }
};

export const deleteAlbum = async (req, res, next) => {
  try {
    const { id } = req.validatedParams ?? req.params;
    const result = await pool.query('DELETE FROM albums WHERE id = $1', [id]);
    if (result.rowCount === 0) throw new NotFoundError('Album not found');
    res.status(200).json({ status: 'success', message: 'Album deleted' });
  } catch (err) {
    next(err);
  }
};