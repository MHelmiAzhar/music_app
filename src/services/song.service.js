import { nanoid } from 'nanoid';
import NotFoundError from '../exceptions/NotFoundError.js';
import {
  insertSong,
  selectSongs,
  selectSongById,
  updateSongById,
  deleteSongById,
} from '../repositories/song.repository.js';

export const createSong = async ({ title, year, genre, performer, duration = null, albumId = null }) => {
  const songId = nanoid(16);
  try {
    const song = await insertSong({
      id: songId,
      title,
      year,
      genre,
      performer,
      duration,
      albumId,
    });
    return song.id;
  } catch (err) {
    if (err.code === '23503') throw new NotFoundError('Album not found');
    throw err;
  }
};

export const getSongs = async ({ title, performer }) => {
  return selectSongs({ title, performer });
};

export const getSongById = async (id) => {
  const song = await selectSongById(id);
  if (!song) throw new NotFoundError('Song not found');
  return song;
};

export const updateSong = async ({ id, title, year, genre, performer, duration = null, albumId = null }) => {
  try {
    const updated = await updateSongById({
      id,
      title,
      year,
      genre,
      performer,
      duration,
      albumId,
    });
    if (!updated) throw new NotFoundError('Song not found');
  } catch (err) {
    if (err.code === '23503') throw new NotFoundError('Album not found');
    throw err;
  }
};

export const deleteSong = async (id) => {
  const deleted = await deleteSongById(id);
  if (!deleted) throw new NotFoundError('Song not found');
};
