import express, { IRouter } from 'express';
import multer from 'multer';
import path from 'path';

import { databaseConnection as pool } from '../../utils/pool';
import { postAnnouncements } from '../../announcements/postAnnouncements';
import { putAnnouncements } from '../../announcements/putAnnouncements';
import { deleteAnnouncements } from '../../announcements/deleteAnnouncements';

const router: IRouter = express.Router();
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

router.use(express.static('uploads'));

postAnnouncements(router, pool, upload);

putAnnouncements(router, pool, upload);

deleteAnnouncements(router, pool);

export default router;
