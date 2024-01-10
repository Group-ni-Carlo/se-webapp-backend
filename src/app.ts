import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

import members from './routes/admin/members';
import auth from './routes/auth';
import announcements from './routes/announcements';
import editAnnouncements from './routes/admin/editAnnouncements';
import partners from './routes/partners';
import editPartners from './routes/admin/editPartners';
import user from './routes/user';
import admin from './routes/admin/admin';
import editMerch from './routes/admin/editMerch';
import statistics from './routes/admin/statistics';
import merch from './routes/merch';
import { checkAdmin } from './middlewares/checkAdmin';
import { authenticateUser } from './middlewares/authenticateUser';
import { checkIfLoggedIn } from './middlewares/checkIfLoggedIn';

const startServer = async () => {
  const app = express();
  const corsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
  };

  dotenv.config();

  app
    .use(cors(corsOptions))
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))
    .use(express.static('uploads'))
    .use('/admin', admin)
    .use('/admin', checkAdmin)
    .use('/admin/announcements', editAnnouncements)
    .use('/admin/partners', editPartners)
    .use('/admin/members', members)
    .use('/admin/merch', editMerch)
    .use('/admin/stats', statistics)
    .use('/', auth)
    .use(checkIfLoggedIn)
    .use('/announcements', authenticateUser, announcements)
    .use('/user', user)
    .use('/partners', authenticateUser, partners)
    .use('/merch', authenticateUser, merch)

    .listen(5000, () => {
      console.log('Server started at https://localhost:5000');
    });
};

startServer();
