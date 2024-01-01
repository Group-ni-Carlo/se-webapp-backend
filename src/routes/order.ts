import express, { Request, Response } from 'express';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const pool = new Pool({
  connectionString: `${process.env.DB_CONNECTION}`
});

const router = express.Router();

router.post('/upload', async (req: Request, res: Response) => {
  const { image } = req.body;
});
