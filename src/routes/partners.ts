import express, { IRouter } from 'express';

import { databaseConnection as pool } from '../utils/pool';
import { getPartners } from '../partners/getPartners';

const router: IRouter = express.Router();

router.use(express.static('uploads'));

getPartners(router, pool);

export default router;
