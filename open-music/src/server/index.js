import express from 'express';
import path from 'path';
import routes from '../routes/index.js';
import notFoundMiddleware from '../middlewares/notfound.middleware.js';
import errorMiddleware from '../middlewares/error.middleware.js';

const app = express();

// global middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));

// routes
app.use('/', routes);

// 404 then error handler (harus paling bawah)
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
