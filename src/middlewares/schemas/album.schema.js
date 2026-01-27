import Joi from 'joi';

export const albumIdParamSchema = Joi.object({
  id: Joi.string().required(),
});

export const createAlbumSchema = Joi.object({
  name: Joi.string().min(1).max(255).required(),
  year: Joi.number().integer().min(1900).max(3000).required(),
});

export const updateAlbumSchema = Joi.object({
  name: Joi.string().min(1).max(255).required(),
  year: Joi.number().integer().min(1900).max(3000).required(),
});