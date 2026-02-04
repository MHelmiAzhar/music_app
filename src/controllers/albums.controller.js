import {
  createAlbum as createAlbumService,
  getAlbums as getAlbumsService,
  getAlbumById as getAlbumByIdService,
  updateAlbum as updateAlbumService,
  deleteAlbum as deleteAlbumService,
} from '../services/album.service.js';

export const createAlbum = async (req, res, next) => {
  try {
    const { name, year } = req.body;
    const albumId = await createAlbumService({ name, year });
    res.status(201).json({ status: 'success', data:{ albumId } });
  } catch (err) {
    next(err);
  }
};

export const getAlbums = async (_req, res, next) => {
  try {
    const albums = await getAlbumsService();
    res.json({ status: 'success', data: { albums } });
  } catch (err) {
    next(err);
  }
};

export const getAlbumById = async (req, res, next) => {
  try {
    const { id } = req.validatedParams ?? req.params;
    const album = await getAlbumByIdService(id);
    res.json({ status: 'success', data: { album } });
  } catch (err) {
    next(err);
  }
};

export const updateAlbum = async (req, res, next) => {
  try {
    const { id } = req.validatedParams ?? req.params;
    const { name, year } = req.body;

    await updateAlbumService({ id, name, year });
    res.json({ status: 'success', message: 'Album updated' });
  } catch (err) {
    next(err);
  }
};

export const deleteAlbum = async (req, res, next) => {
  try {
    const { id } = req.validatedParams ?? req.params;
    await deleteAlbumService(id);
    res.status(200).json({ status: 'success', message: 'Album deleted' });
  } catch (err) {
    next(err);
  }
};