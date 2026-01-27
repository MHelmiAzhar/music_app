import express from 'express';
import routes from '../routes/index.js';
import notFoundMiddleware from '../middlewares/notfound.middleware.js';
import errorMiddleware from '../middlewares/error.middleware.js';

const app = express();

// global middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use('/', routes);

// 404 then error handler (harus paling bawah)
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
