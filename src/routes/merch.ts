import express, { IRouter } from 'express';

import { databaseConnection as pool } from '../utils/pool';
import { getMerch } from '../merch/getMerch';

const router: IRouter = express.Router();

router.use(express.static('uploads'));

getMerch(router, pool);

export default router;
