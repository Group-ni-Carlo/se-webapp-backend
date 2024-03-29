import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { databaseConnection as pool } from '../utils/pool';

const router = express.Router();

router
  .post('/register', async (req: Request, res: Response) => {
    try {
      const { email, password, firstName, lastName } = req.body;

      if (!password) {
        console.log('Password is null');
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const connection = await pool.connect();
      const insertUser = /* sql */ `
        INSERT INTO public.Users (id, first_name, last_name)
        VALUES (DEFAULT, $1, $2) 
        RETURNING id
        `;
      const insertUserLogins = /* sql */ `
        INSERT INTO public.UserLogins (email, password, user_id)
        VALUES ($1, $2, $3)
        `;
      const { rows } = await connection.query(insertUser, [
        firstName,
        lastName
      ]);
      if (rows.length > 0) {
        await connection.query(insertUserLogins, [
          email,
          hashedPassword,
          rows[0].id
        ]);
      }
      connection.release();
      res.status(200).json({ message: 'User registered!' });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'Failed registration' });
    }
  })
  .post('/login', async (req: Request, res: Response) => {
    const error = 'Invalid email or password';
    try {
      const { email, password } = req.body;
      const connection = await pool.connect();
      const checkUser = /* sql */ `
        SELECT ul.id, ul.email, ul.password, ul.user_id, u.approval 
        FROM public.UserLogins as ul
        JOIN Users AS u ON ul.user_id = u.id
        WHERE email = $1
        `;
      const { rows } = await connection.query(checkUser, [email]);
      connection.release();
      if (rows.length > 0) {
        const correctPassword = await bcrypt.compare(
          password,
          rows[0].password
        );
        if (correctPassword) {
          if (rows[0].approval === 'APPROVED') {
            const token = jwt.sign(
              { user: rows[0].user_id },
              `${process.env.CODE}`,
              {
                expiresIn: '24h'
              }
            );
            res.status(200).json({ token, message: 'Login successful' });
          } else {
            res.status(401).json({ message: 'User not approved!' });
          }
        } else {
          res.status(401).json({ message: error });
        }
      } else {
        res.status(404).json({ message: error });
      }
    } catch (err) {
      console.log(err);
      res.status(404).json({ message: error });
    }
  });

export default router;
