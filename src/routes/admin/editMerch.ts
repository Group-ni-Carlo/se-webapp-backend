import express, { IRouter } from 'express';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';

import { postMerch } from '../../merch/postMerch';
import { putMerch } from '../../merch/putMerch';
import { deleteMerch } from '../../merch/deleteMerch';

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

postMerch(router, db, upload);

putMerch(router, db, upload);

deleteMerch(router, db);

export default router;
