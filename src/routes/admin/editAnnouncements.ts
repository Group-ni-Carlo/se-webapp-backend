import express, { IRouter } from 'express';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';

import { postAnnouncements } from '../../announcements/postAnnouncements';
import { putAnnouncements } from '../../announcements/putAnnouncements';
import { deleteAnnouncements } from '../../announcements/deleteAnnouncements';

dotenv.config();

const db = new Pool({
  connectionString: `${process.env.DB_CONNECTION}`
});

const router: IRouter = express.Router();
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

router.use(express.static('uploads'));

postAnnouncements(router, db, upload);

putAnnouncements(router, db, upload);

deleteAnnouncements(router, db);

export default router;
