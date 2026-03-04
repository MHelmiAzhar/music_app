import {
  createPlaylist as createPlaylistService,
  getPlaylists as getPlaylistsService,
  getPlaylistById as getPlaylistByIdService,
  getPlaylistSongs as getPlaylistSongsService,
  getPlaylistActivities as getPlaylistActivitiesService,
  updatePlaylist as updatePlaylistService,
  deletePlaylist as deletePlaylistService,
  addSongToPlaylist as addSongToPlaylistService,
  deleteSongFromPlaylist as deleteSongFromPlaylistService,
} from '../services/playlist.service.js';

export const createPlaylist = async (req, res, next) => {
  try {
    const { name } = req.body;
    const owner = req.auth.id;
    const playlistId = await createPlaylistService({ name, owner });
    res.status(201).json({ status: 'success', data: { playlistId } });
  } catch (err) {
    next(err);
  }
};

export const getPlaylists = async (req, res, next) => {
  try {
    const userId = req.auth.id;
    const playlists = await getPlaylistsService(userId);
    res.json({ status: 'success', data: { playlists } });
  } catch (err) {
    next(err);
  }
};

export const getPlaylistById = async (req, res, next) => {
  try {
    const { id } = req.validatedParams ?? req.params;
    const userId = req.auth.id;
    const playlist = await getPlaylistByIdService({ id, userId });
    res.json({ status: 'success', data: { playlist } });
  } catch (err) {
    next(err);
  }
};

export const getPlaylistSongs = async (req, res, next) => {
  try {
    const { id } = req.validatedParams ?? req.params;
    const userId = req.auth.id;
    const playlist = await getPlaylistSongsService({ id, userId });
    res.json({ status: 'success', data: { playlist } });
  } catch (err) {
    next(err);
  }
};

export const updatePlaylist = async (req, res, next) => {
  try {
    const { id } = req.validatedParams ?? req.params;
    const { name } = req.body;
    const userId = req.auth.id;
    await updatePlaylistService({ id, name, userId });
    res.json({ status: 'success', message: 'Playlist updated' });
  } catch (err) {
    next(err);
  }
};

export const addSongToPlaylist = async (req, res, next) => {
  try {
    const { id: playlistId } = req.validatedParams ?? req.params;
    const { songId } = req.body;
    const userId = req.auth.id;
    await addSongToPlaylistService({ playlistId, songId, userId });
    res.status(201).json({ status: 'success', message: 'Song added to playlist' });
  } catch (err) {
    next(err);
  }
};

export const deleteSongFromPlaylist = async (req, res, next) => {
  try {
    const { id: playlistId } = req.validatedParams ?? req.params;
    const { songId } = req.body;
    const userId = req.auth.id;
    await deleteSongFromPlaylistService({ playlistId, songId, userId });
    res.json({ status: 'success', message: 'Song removed from playlist' });
  } catch (err) {
    next(err);
  }
};

export const getPlaylistActivities = async (req, res, next) => {
  try {
    const { id: playlistId } = req.validatedParams ?? req.params;
    const userId = req.auth.id;
    const activities = await getPlaylistActivitiesService({ playlistId, userId });
    res.json({
      status: 'success',
      data: {
        playlistId,
        activities,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const deletePlaylist = async (req, res, next) => {
  try {
    const { id } = req.validatedParams ?? req.params;
    const userId = req.auth.id;
    await deletePlaylistService({ id, userId });
    res.json({ status: 'success', message: 'Playlist deleted' });
  } catch (err) {
    next(err);
  }
};
