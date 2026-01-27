import Joi from 'joi';

export const songIdParamSchema = Joi.object({
  id: Joi.string().required(),
});

export const createSongSchema = Joi.object({
  title: Joi.string().min(1).max(255).required(),
  year: Joi.number().integer().min(1900).max(3000).required(),
  genre: Joi.string().min(1).max(100).required(),
  performer: Joi.string().min(1).max(255).required(),
  duration: Joi.number().integer().positive().optional().allow(null).empty(''),
  albumId: Joi.string().optional().allow(null).empty(''),
});

export const updateSongSchema = Joi.object({
  title: Joi.string().min(1).max(255).required(),
  year: Joi.number().integer().min(1900).max(3000).required(),
  genre: Joi.string().min(1).max(100).required(),
  performer: Joi.string().min(1).max(255).required(),
  duration: Joi.number().integer().positive().optional().allow(null).empty(''),
  albumId: Joi.string().optional().allow(null).empty(''),
});

export const songQuerySchema = Joi.object({
  title: Joi.string().min(1).max(255).optional(),
  performer: Joi.string().min(1).max(255).optional(),
});