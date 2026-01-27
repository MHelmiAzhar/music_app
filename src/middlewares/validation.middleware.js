import Joi from 'joi';
import InvariantError from '../exceptions/InvariantError.js';

export const validateBody = (schema) => (req, _res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
  if (error) return next(new InvariantError(error.details.map((d) => d.message).join(', ')));
  req.body = value;
  next();
};

export const validateParams = (schema) => (req, _res, next) => {
  const { error, value } = schema.validate(req.params, { abortEarly: false, stripUnknown: true });
  if (error) return next(new InvariantError(error.details.map((d) => d.message).join(', ')));
  req.validatedParams = value;
  next();
};

export const validateQuery = (schema) => (req, _res, next) => {
  const { error, value } = schema.validate(req.query, { abortEarly: false, stripUnknown: true });
  if (error) return next(new InvariantError(error.details.map((d) => d.message).join(', ')));
  req.validatedQuery = value;
  next();
};

export const JoiSchema = Joi;