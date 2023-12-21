import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import members from './routes/members';
import auth from './routes/auth';

const startServer = async () => {
  const app = express();

  app
    .use(cors())
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))
    .get(`/members/list`, async (req, res) => {
      try {
        const connection = await pool.connect();
        const query = `
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
    .listen(5000, () => {
      console.log('Server started at https://localhost:5000');
    });
};

startServer();
