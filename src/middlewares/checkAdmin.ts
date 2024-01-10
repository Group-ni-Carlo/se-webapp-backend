import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { databaseConnection as pool } from '../utils/pool';

export const checkAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.header('Authorization');
  const token = authHeader?.split(' ')[1];

  if (!token) {
    res.status(401).json({ status: false });
  } else {
    try {
      const connection = await pool.connect();
      const claims = jwt.verify(token, `${process.env.CODE}`);
      const { user } = claims as any;
      const checkUser = /* sql */ `
           SELECT u.id, u.approval, u.type 
           FROM public.users as u
           WHERE u.id = $1
           `;
      const { rows } = await connection.query(checkUser, [user]);
      connection.release();
      if (
        rows.length > 0 &&
        rows[0].approval === 'APPROVED' &&
        rows[0].type === 'admin'
      ) {
        next();
      } else {
        res.status(401).json({ status: false });
      }
    } catch (err) {
      console.log(err);
      res.status(400).json({ status: false });
    }
  }
};
