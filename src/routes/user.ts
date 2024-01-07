import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { databaseConnection as pool } from '../utils/pool';

const router = express.Router();

router.get('/profile', async (req: Request, res: Response) => {
  const authHeader = req.header('Authorization');
  const token = authHeader?.split(' ')[1];

  if (!token) {
    res.status(201).json({ status: false });
  } else {
    try {
      const connection = await pool.connect();
      const claims = jwt.verify(token, `${process.env.CODE}`);
      const { user } = claims as any;
      const getInfo = /* sql */ `
        SELECT u.id, u.first_name, u.last_name, u.type, u.year_level, u.approval 
        FROM public.users as u
        WHERE u.id = $1
        `;
      const { rows } = await connection.query(getInfo, [user]);
      connection.release();
      if (rows.length > 0) {
        res.status(200).json({ userInfo: rows[0], status: true });
      } else {
        res.status(401).json({ status: false });
      }
    } catch (err) {
      console.log(err);
      res.status(400).json({ err });
    }
  }
});

export default router;
