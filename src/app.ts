import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import members from './routes/admin/members';
import auth from './routes/auth';
import announcements from './routes/announcements';
import editAnnouncements from './routes/admin/editAnnouncements';
import user from './routes/user';
import admin from './routes/admin/admin';
import { checkAdmin } from './middlewares/checkAdmin';
import { authenticateUser } from './middlewares/authenticateUser';
import { checkIfLoggedIn } from './middlewares/checkIfLoggedIn';

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
    .use('/admin', admin)
    .use('/admin/announcements', checkAdmin, editAnnouncements)
    .use('/admin/members', checkAdmin, members)
    .use('/', checkIfLoggedIn, auth)
    .use('/announcements', authenticateUser, announcements)
    .use('/user', authenticateUser, user)
    .listen(5000, () => {
      console.log('Server started at https://localhost:5000');
    });
};

startServer();
