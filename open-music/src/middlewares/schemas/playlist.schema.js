import Joi from 'joi';

export const playlistIdParamSchema = Joi.object({
  id: Joi.string().required(),
});

export const createPlaylistSchema = Joi.object({
  name: Joi.string().min(1).max(255).required(),
});

export const updatePlaylistSchema = Joi.object({
  name: Joi.string().min(1).max(255).required(),
});

export const addSongToPlaylistSchema = Joi.object({
  songId: Joi.string().required(),
});
