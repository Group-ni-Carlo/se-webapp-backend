import express, { IRouter } from 'express';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';

import { postPartners } from '../../partners/postPartners';
import { putPartners } from '../../partners/putPartners';
import { deletePartners } from '../../partners/deletePartners';

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

postPartners(router, db, upload);

putPartners(router, db, upload);

deletePartners(router, db);

export default router;
