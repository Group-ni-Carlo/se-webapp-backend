import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

dotenv.config();
const pool = new Pool({
  connectionString: `${process.env.DB_CONNECTION}`
});

const startServer = async () => {
  const app = express();

  app
    .use(cors())
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))
    .get(`/members/list`, async (req, res) => {
      try {
        const connection = await pool.connect();
        const query = /* sql */ `
        SELECT m.id, m.name, m.email, m.year, m.approval FROM public.members as m
        WHERE m.approval = 'APPROVED'
        ORDER BY m.id ASC
        `;
        const result = await connection.query(query);
        connection.release();
        if (result.rows.length > 0) {
          res.status(200).json(result.rows);
        } else {
          res.status(200).json([]);
        }
      } catch (err) {
        console.log(err);
        res.status(500);
      }
    })
    .get(`/members/requests`, async (req, res) => {
      try {
        const connection = await pool.connect();
        const query = /* sql */ `
        SELECT m.id, m.name, m.email, m.year, m.approval FROM public.members as m
        WHERE m.approval = 'PENDING'
        ORDER BY m.id ASC 
        `;
        const result = await connection.query(query);
        connection.release();
        if (result.rows.length > 0) {
          res.status(200).json(result.rows);
        } else {
          res.status(200).json([]);
        }
      } catch (err) {
        console.log(err);
        res.status(500).send('Failed to retrieve requests');
      }
    })
    .delete('/members/delete', async (req, res) => {
      try {
        const { id } = req.body;
        const connection = await pool.connect();
        const deleteMember = /* sql */ `
        DELETE FROM public.members
        WHERE id = $1
        `;
        await connection.query(deleteMember, [id]);
        connection.release();
        res.status(200).send('Member deleted!');
      } catch (err) {
        console.log(err);
        res.status(500).send('Failed to delete member');
      }
    })
    .patch('/members/approve', async (req, res) => {
      try {
        const { id } = req.body;
        const connection = await pool.connect();
        const approveMember = /* sql */ `
        UPDATE public.members
        SET approval = $1
        WHERE id = $2
        `;
        await connection.query(approveMember, ['APPROVED', id]);
        connection.release();
        res.status(200).send('Member approved!');
      } catch (err) {
        console.log(err);
        res.status(500).send('Failed to appprove request');
      }
    })
    .post('/register', async (req, res) => {
      try {
        const { email, password, firstName, lastName } = req.body;
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
    .post('/login', async (req, res) => {
      try {
        const { email, password } = req.body;
        const connection = await pool.connect();
        const checkUser = /* sql */ `
        SELECT id, email, password, user_id FROM public.UserLogins
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
            const token = jwt.sign(
              { user: rows[0].user_id },
              `${process.env.CODE}`,
              {
                expiresIn: '1h'
              }
            );
            res.json({ token, message: 'Login successful' });
          } else {
            res.status(401).json({ message: 'Invalid email or password' });
          }
        } else {
          res.status(404).send('No user found');
        }
      } catch (err) {
        console.log(err);
        res.status(500).send('Failed to log in user');
      }
    })
    .get('/me', async (req, res) => {
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
          SELECT u.id, u.first_name, u.last_name, u.year_level, u.approval 
          FROM public.users as u
          WHERE u.id = $1
          `;
          const { rows } = await connection.query(checkUser, [user]);
          connection.release();
          let userInfo: {
            firstName: string;
            lastName: string;
            email: string;
            yearLevel: string;
          };
          if (rows.length > 0) {
            userInfo = {
              firstName: rows[0].first_name,
              lastName: rows[0].last_name,
              email: rows[0].email,
              yearLevel: rows[0].year
            };
            res.status(200).json({ me: userInfo, status: true });
          } else {
            res.status(401).json({ status: false });
          }
        } catch (err) {
          console.log(err);
          res.status(400).json({ err });
        }
      }
    })

    .listen(5000, () => {
      console.log('Server started at https://localhost:5000');
    });
};

startServer();
