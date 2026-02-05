import { nanoid } from 'nanoid';
import NotFoundError from '../exceptions/NotFoundError.js';
import {
  insertAlbum,
  selectAlbums,
  selectAlbumById,
  selectAlbumSongs,
  updateAlbumById,
  updateAlbumCoverById,
  deleteAlbumById,
} from '../repositories/album.repository.js';
import fs from 'fs/promises';
import path from 'path';

export const createAlbum = async ({ name, year }) => {
  const albumId = nanoid(16);
  const album = await insertAlbum({ id: albumId, name, year });
  return album.id;
};

export const getAlbums = async () => {
  return selectAlbums();
};

export const getAlbumById = async (id) => {
  const album = await selectAlbumById(id);
  if (!album) throw new NotFoundError('Album not found');

  const songs = await selectAlbumSongs(id);
  return { ...album, songs };
};

export const updateAlbumCover = async ({ id, coverFilename }) => {
  const album = await selectAlbumById(id);
  if (!album) throw new NotFoundError('Album not found');

  const updated = await updateAlbumCoverById({ id, coverUrl: coverFilename });
  if (!updated) throw new NotFoundError('Album not found');

  if (album.coverUrl) {
    const oldCoverPath = path.resolve(process.cwd(), 'uploads', 'covers', album.coverUrl);
    try {
      await fs.unlink(oldCoverPath);
    } catch {
      // ignore if old file is missing
    }
  }
};

export const updateAlbum = async ({ id, name, year }) => {
  const updated = await updateAlbumById({ id, name, year });
  if (!updated) throw new NotFoundError('Album not found');
};

export const deleteAlbum = async (id) => {
  const deleted = await deleteAlbumById(id);
  if (!deleted) throw new NotFoundError('Album not found');
};
