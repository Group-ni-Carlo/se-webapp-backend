import express from 'express';
import cors from 'cors';
import db from '../../db/dbConnection';
import multer from 'multer';
import { getAnnouncements } from './getAnnouncements';
import { postAnnouncements } from './postAnnouncements';
import path from 'path';

export const announcementsApp = () => {
  const app = express();
  const storage = multer.diskStorage({ destination: 'uploads/', filename: (req, file, cb) => { cb(null, Date.now() + path.extname(file.originalname)) } })
  const upload = multer({ storage });

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const corsOptions = {
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
  };

  app.use(cors(corsOptions));
  app.use(express.static('uploads'));

  db.connect()
    .then(() => {
      console.log('Connected to PostgreSQL');
    })
    .catch((error) => {
      console.error('Error connecting to PostgreSQL:', error);
      process.exit(1);
    });

  getAnnouncements(app, db);

  postAnnouncements(app, db, upload);

  app.listen(3001, () => { console.log('Server started at https://localhost:3001') })
}

announcementsApp();
