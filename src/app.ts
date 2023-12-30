import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import members from './routes/members';
import auth from './routes/auth';

const startServer = async () => {
  const app = express();

  app
    .use(cors())
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))
    .use('/members', members)
    .use('/', auth)
    .listen(5000, () => {
      console.log('Server started at https://localhost:5000');
    });
};

startServer();
