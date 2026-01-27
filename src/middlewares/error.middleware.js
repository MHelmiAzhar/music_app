import ClientError from '../exceptions/ClientError.js';

const errorMiddleware = (err, _req, res, _next) => {
  if (err instanceof ClientError) {
    return res.status(err.statusCode).json({ status: 'fail', message: err.message });
  }

  console.error(err);
  return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
};

export default errorMiddleware;