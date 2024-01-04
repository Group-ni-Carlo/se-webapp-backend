import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import members from './routes/members';
import auth from './routes/auth';
import announcements from './routes/announcements';
import editAnnouncements from './routes/admin/editAnnouncements';
import authenticateUser from './middlewares/authenticateUser';

const startServer = async () => {
  const app = express();
  const corsOptions = {
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
  };

  app
    .use(cors(corsOptions))
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))
    .use(express.static('uploads'))
    .use('/members', members)
    .use('/', auth)
    .use('/announcements', announcements)
    .use('/admin/announcements', editAnnouncements)
    .listen(5000, () => {
      console.log('Server started at https://localhost:5000');
    });
};

startServer();
