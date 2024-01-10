import express, { IRouter } from 'express';
import multer from 'multer';
import path from 'path';

import { databaseConnection as pool } from '../../utils/pool';
import { postPartners } from '../../partners/postPartners';
import { putPartners } from '../../partners/putPartners';
import { deletePartners } from '../../partners/deletePartners';

const router: IRouter = express.Router();
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

router.use(express.static('uploads'));

postPartners(router, pool, upload);

putPartners(router, pool, upload);

deletePartners(router, pool);

export default router;
