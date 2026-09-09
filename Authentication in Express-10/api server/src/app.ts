import cors from 'cors';
import express from 'express';
import '#db';
import { errorHandler, notFoundHandler } from '#middleware';
import { postRoutes } from '#routes';
import { PORT } from '#config';

const app = express();

app.use(
  cors({
    origin: '*',
    exposedHeaders: ['WWW-Authenticate'] // needed to send the 'refresh trigger''
  })
);
app.use(express.json());

app.use('/posts', postRoutes);

app.use('*splat', notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => console.log(`API Server listening on http://localhost:${PORT}`));
