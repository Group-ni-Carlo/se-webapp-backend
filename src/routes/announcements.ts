import express, { IRouter } from 'express';

import { databaseConnection as pool } from '../utils/pool';
import { getAnnouncements } from '../announcements/getAnnouncements';

const router: IRouter = express.Router();

router.use(express.static('uploads'));

getAnnouncements(router, pool);

export default router;
