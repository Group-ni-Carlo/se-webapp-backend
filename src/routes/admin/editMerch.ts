import express, { IRouter } from 'express';
import multer from 'multer';
import path from 'path';

import { databaseConnection as pool } from '../../utils/pool';
import { postMerch } from '../../merch/postMerch';
import { putMerch } from '../../merch/putMerch';
import { deleteMerch } from '../../merch/deleteMerch';

const router: IRouter = express.Router();
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

router.use(express.static('uploads'));

postMerch(router, pool, upload);

putMerch(router, pool, upload);

deleteMerch(router, pool);

export default router;
