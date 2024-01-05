import express, { IRouter } from 'express';
import { Pool } from 'pg';
import dotenv from 'dotenv';

import { getPartners } from '../partners/getPartners';

dotenv.config();

const db = new Pool({
  connectionString: `${process.env.DB_CONNECTION}`
});

const router: IRouter = express.Router();

router.use(express.static('uploads'));

getPartners(router, db);

export default router;
