import { nanoid } from 'nanoid';
import NotFoundError from '../exceptions/NotFoundError.js';
import AuthorizationError from '../exceptions/AuthorizationError.js';
import InvariantError from '../exceptions/InvariantError.js';
import {
  insertPlaylist,
  selectPlaylistsByUser,
  selectPlaylistOwner,
  selectPlaylistWithOwner,
  updatePlaylistById,
  deletePlaylistById,
  selectPlaylistSongs,
  insertPlaylistSong,
  deletePlaylistSong,
} from '../repositories/playlist.repository.js';
import { selectSongExists } from '../repositories/song.repository.js';
import { findCollaborator } from '../repositories/collaboration.repository.js';
import {
  insertPlaylistActivity,
  selectPlaylistActivities,
} from '../repositories/playlist-activity.repository.js';

const verifyPlaylistOwner = async (playlistId, userId) => {
  const playlist = await selectPlaylistOwner(playlistId);
  if (!playlist) throw new NotFoundError('Playlist not found');
  if (playlist.owner !== userId) throw new AuthorizationError('You do not have access to this resource');
};

const verifyPlaylistAccess = async (playlistId, userId) => {
  const playlist = await selectPlaylistOwner(playlistId);
  if (!playlist) throw new NotFoundError('Playlist not found');
  if (playlist.owner === userId) return;

  const collab = await findCollaborator({ playlistId, userId });
  if (!collab) throw new AuthorizationError('You do not have access to this resource');
};

export const createPlaylist = async ({ name, owner }) => {
  const playlistId = `playlist-${nanoid(16)}`;
  const result = await insertPlaylist({ id: playlistId, name, owner });
  return result.id;
};

export const getPlaylists = async (userId) => {
  return selectPlaylistsByUser(userId);
};

export const getPlaylistById = async ({ id, userId }) => {
  await verifyPlaylistAccess(id, userId);
  const playlist = await selectPlaylistWithOwner(id);
  if (!playlist) throw new NotFoundError('Playlist not found');
  return playlist;
};

export const getPlaylistSongs = async ({ id, userId }) => {
  await verifyPlaylistAccess(id, userId);
  const playlist = await selectPlaylistWithOwner(id);
  if (!playlist) throw new NotFoundError('Playlist not found');

  const songs = await selectPlaylistSongs(id);
  return { ...playlist, songs };
};

export const updatePlaylist = async ({ id, name, userId }) => {
  await verifyPlaylistAccess(id, userId);
  const updated = await updatePlaylistById({ id, name });
  if (!updated) throw new NotFoundError('Playlist not found');
};

export const addSongToPlaylist = async ({ playlistId, songId, userId }) => {
  await verifyPlaylistAccess(playlistId, userId);

  const songExists = await selectSongExists(songId);
  if (!songExists) throw new NotFoundError('Song not found');

  const playlistSongId = `playlist-song-${nanoid(16)}`;
  try {
    await insertPlaylistSong({ id: playlistSongId, playlistId, songId });
  } catch (err) {
    if (err.code === '23505') throw new InvariantError('Song already exists in playlist');
    if (err.code === '23503') throw new NotFoundError('Playlist or song not found');
    throw err;
  }

  const activityId = `activity-${nanoid(16)}`;
  await insertPlaylistActivity({
    id: activityId,
    playlistId,
    songId,
    userId,
    action: 'add',
  });
};

export const deleteSongFromPlaylist = async ({ playlistId, songId, userId }) => {
  await verifyPlaylistAccess(playlistId, userId);

  const deleted = await deletePlaylistSong({ playlistId, songId });
  if (!deleted) throw new NotFoundError('Song not found in playlist');

  const activityId = `activity-${nanoid(16)}`;
  await insertPlaylistActivity({
    id: activityId,
    playlistId,
    songId,
    userId,
    action: 'delete',
  });
};

export const getPlaylistActivities = async ({ playlistId, userId }) => {
  await verifyPlaylistAccess(playlistId, userId);
  return selectPlaylistActivities(playlistId);
};

export const deletePlaylist = async ({ id, userId }) => {
  await verifyPlaylistOwner(id, userId);
  const deleted = await deletePlaylistById(id);
  if (!deleted) throw new NotFoundError('Playlist not found');
};

export const verifyOwner = verifyPlaylistOwner;
export const verifyAccess = verifyPlaylistAccess;
