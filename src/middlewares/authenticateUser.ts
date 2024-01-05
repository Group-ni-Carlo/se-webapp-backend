import { Request, Response, NextFunction } from 'express';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();
const pool = new Pool({
  connectionString: `${process.env.DB_CONNECTION}`
});

export const authenticateUser = async (
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
      if (rows.length > 0 && rows[0].approval === 'APPROVED') {
        console.log('you are user!');
        next();
      } else {
        res.status(401).json({ status: false });
      }
    } catch (err) {
      console.log(err);
      res.status(400).json({ err });
    }
  }
};
