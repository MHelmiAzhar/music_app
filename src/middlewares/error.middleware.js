import ClientError from '../exceptions/ClientError.js';
import multer from 'multer';

const errorMiddleware = (err, _req, res, _next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ status: 'fail', message: 'Ukuran file melebihi 512000 bytes' });
    }
    return res.status(400).json({ status: 'fail', message: err.message });
  }

  if (err instanceof ClientError) {
    return res.status(err.statusCode).json({ status: 'fail', message: err.message });
  }

  console.error(err);
  return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
};

export default errorMiddleware;