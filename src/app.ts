import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import bodyParser from 'body-parser';

const pool = new Pool({
  connectionString: `postgres://sewebapp_user:luEjNrUHQL8NdP4E6ZWnbCGBEMziWzWi@dpg-cln8uohr6k8c73ad86bg-a.singapore-postgres.render.com/sewebapp?ssl=true`
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
        const query = /* sql */ `
        DELETE FROM public.members
        WHERE id = $1
        `;
        const result = await connection.query(query, [id]);
        connection.release();
        res.status(200).send('Member deleted!');
      } catch (err) {
        console.log(err);
        res.status(500).send('Failed to delete member');
      }
    })
    .patch('/members/requests/approve', async (req, res) => {
      try {
        const { id } = req.body;
        const connection = await pool.connect();
        const query = /* sql */ `
        UPDATE public.members
        SET approval = $1
        WHERE id = $2
        `;
        const result = await connection.query(query, ['APPROVED', id]);
        connection.release();
        res.status(200).send('Member approved!');
      } catch (err) {
        console.log(err);
        res.status(500).send('Failed to appprove request');
      }
    })
    .listen(5000, () => {
      console.log('Server started at https://localhost:5000');
    });
};

startServer();
