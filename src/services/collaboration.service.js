import { nanoid } from 'nanoid';
import NotFoundError from '../exceptions/NotFoundError.js';
import InvariantError from '../exceptions/InvariantError.js';
import {
  findCollaborator,
  insertCollaborator,
  deleteCollaborator,
} from '../repositories/collaboration.repository.js';
import { selectPlaylistOwner } from '../repositories/playlist.repository.js';
import { findUserById } from '../repositories/user.repository.js';
import AuthorizationError from '../exceptions/AuthorizationError.js';

const verifyPlaylistOwner = async (playlistId, userId) => {
  const playlist = await selectPlaylistOwner(playlistId);
  if (!playlist) throw new NotFoundError('Playlist not found');
  if (playlist.owner !== userId) throw new AuthorizationError('You do not have access to this resource');
};

export const addCollaborator = async ({ playlistId, userId, ownerId }) => {
  await verifyPlaylistOwner(playlistId, ownerId);

  const user = await findUserById(userId);
  if (!user) throw new NotFoundError('User not found');

  const existing = await findCollaborator({ playlistId, userId });
  if (existing) throw new InvariantError('Collaborator already exists');

  const collaboratorId = `collab-${nanoid(16)}`;
  await insertCollaborator({ id: collaboratorId, playlistId, userId });
  return collaboratorId;
};

export const removeCollaborator = async ({ playlistId, userId, ownerId }) => {
  await verifyPlaylistOwner(playlistId, ownerId);

  const deleted = await deleteCollaborator({ playlistId, userId });
  if (!deleted) throw new NotFoundError('Collaborator not found');
};
