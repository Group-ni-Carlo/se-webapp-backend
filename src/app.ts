import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import bodyParser from 'body-parser';

const pool = new Pool({
  connectionString: `postgres://sewebapp_user:luEjNrUHQL8NdP4E6ZWnbCGBEMziWzWi@dpg-cln8uohr6k8c73ad86bg-a.singapore-postgres.render.com/sewebapp?ssl=true`
});

const secondPool = new Pool({
  connectionString:'postgres://login_f99n_user:q0zi2Nhcsildfe3ZaMRrlQ71LZc407f2@dpg-cm05lped3nmc738k08d0-a.singapore-postgres.render.com/login_f99n?ssl=true'
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
      const { firstname, lastname, username, email, password } = req.body;
      const connection = await secondPool.connect();
      const insertUser = /* sql */ `
      INSERT INTO public.login (firstname, lastname, username, email, password)
      VALUES ($1, $2, $3, $4, $5)
      `;

      if (password.length < 6) {
        res.status(400).send('Password must be at least 6 characters long');
        return;
      }
      
      await connection.query(insertUser, [firstname, lastname, username, email, password]);
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
        const connection = await secondPool.connect();
        const checkUser = /* sql */ `
        SELECT * FROM public.login
        WHERE email = $1
        `;
        const result = await connection.query(checkUser, [email]);
        connection.release();
        if (result.rows.length > 0) {
          if (result.rows[0].password === password) {
            res.status(200).send('User logged in!');
          } else {
            res.status(401).send('Invalid credentials');
          }
        } else {
          res.status(404).send('No user found');
        }
      } catch (err) {
        console.log(err);
        res.status(500).send('Failed to log in user');
      }
    })
    
    .listen(5000, () => {
      console.log('Server started at https://localhost:5000');
    });
};

startServer();



