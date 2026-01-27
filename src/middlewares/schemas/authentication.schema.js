import Joi from 'joi';

export const createAuthenticationSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

export const refreshAuthenticationSchema = Joi.object({
  refreshToken: Joi.string().required(),
});
