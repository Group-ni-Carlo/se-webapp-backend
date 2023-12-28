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
        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const connection = await pool.connect();
        const insertUser = /* sql */ `
      INSERT INTO public.UserLogins (email, password)
      VALUES ($1, $2)
      `;
        await connection.query(insertUser, [email, hashedPassword]);
        connection.release();
        res.status(200).send('User registered!');
      } catch (err) {
        console.log(err);
        res.status(500).send('Failed to register user');
      }
    })
    .post('/login', async (req, res) => {
      try {
        const { email, password } = req.body;
        const connection = await pool.connect();
        const checkUser = /* sql */ `
        SELECT * FROM public.UserLogins
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
            const token = jwt.sign({ user: 'Test' }, 'secret', {
              expiresIn: '1h'
            });
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
        res.status(400).json({ message: 'Not Logged In' });
      } else {
        try {
          const claims = jwt.verify(token, 'secret');
          const { userId } = claims as any;
          userId;
          // get from database

          res.status(200).json({ me: 'User', status: true });
        } catch (err) {
          res.status(400).json({ status: false });
        }
      }
    })

    .listen(5000, () => {
      console.log('Server started at https://localhost:5000');
    });
};

startServer();
