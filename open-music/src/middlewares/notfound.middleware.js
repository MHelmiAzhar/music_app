import NotFoundError from '../exceptions/NotFoundError.js';

const notFoundMiddleware = (req, res, next) => {
  next(new NotFoundError('Route not found'));
};

export default notFoundMiddleware;