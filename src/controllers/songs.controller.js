import {
  createSong as createSongService,
  getSongs as getSongsService,
  getSongById as getSongByIdService,
  updateSong as updateSongService,
  deleteSong as deleteSongService,
} from '../services/song.service.js';

export const createSong = async (req, res, next) => {
  try {
    const { title, year, genre, performer, duration = null, albumId = null } = req.body;
    const songId = await createSongService({ title, year, genre, performer, duration, albumId });
    res.status(201).json({ status: 'success', data: { songId } });
  } catch (err) {
    next(err);
  }
};

export const getSongs = async (req, res, next) => {
  try {
    const { title, performer } = req.validatedQuery ?? req.query;
    const songs = await getSongsService({ title, performer });
    res.json({ status: 'success', data: { songs } });
  } catch (err) {
    next(err);
  }
};

export const getSongById = async (req, res, next) => {
  try {
    const { id } = req.validatedParams ?? req.params;
    const song = await getSongByIdService(id);
    res.json({ status: 'success', data: { song } });
  } catch (err) {
    next(err);
  }
};

export const updateSong = async (req, res, next) => {
  try {
    const { id } = req.validatedParams ?? req.params;
    const { title, year, genre, performer, duration = null, albumId = null } = req.body;
    await updateSongService({ id, title, year, genre, performer, duration, albumId });
    res.json({ status: 'success', message: 'Song updated' });
  } catch (err) {
    next(err);
  }
};

export const deleteSong = async (req, res, next) => {
  try {
    const { id } = req.validatedParams ?? req.params;
    await deleteSongService(id);
    res.status(200).json({ status: 'success', message: 'Song deleted' });
  } catch (err) {
    next(err);
  }
};