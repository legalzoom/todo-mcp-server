import cors from 'cors';
import express, { type Express } from 'express';
import { errorHandler } from './handlers/error.js';
import { notFoundHandler } from './handlers/notFound.js';
import { middleware } from './logging/middleware.js';
import { router } from './routes/index.js';

export const port = Number.parseInt(process.env.PORT || '8080', 10);

export const app: Express = express();

if (process.env.NODE_ENV !== 'production') {
  app.use(cors());
}

app.use(express.json());
app.use(middleware);
app.use(router);

app.use(notFoundHandler);
app.use(errorHandler);
