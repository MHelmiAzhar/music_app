import {
  addCollaborator as addCollaboratorService,
  removeCollaborator as removeCollaboratorService,
} from '../services/collaboration.service.js';

export const addCollaborator = async (req, res, next) => {
  try {
    const { playlistId, userId } = req.body;
    const ownerId = req.auth.id;
    const collaborationId = await addCollaboratorService({ playlistId, userId, ownerId });
    res.status(201).json({ status: 'success', data: { collaborationId } });
  } catch (err) {
    next(err);
  }
};

export const removeCollaborator = async (req, res, next) => {
  try {
    const { playlistId, userId } = req.body;
    const ownerId = req.auth.id;
    await removeCollaboratorService({ playlistId, userId, ownerId });
    res.json({ status: 'success', message: 'Collaborator removed' });
  } catch (err) {
    next(err);
  }
};
