import Joi from 'joi';

export const exportPlaylistParamSchema = Joi.object({
  playlistId: Joi.string().required(),
});

export const exportPlaylistBodySchema = Joi.object({
  targetEmail: Joi.string().email().required(),
});
