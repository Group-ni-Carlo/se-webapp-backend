import express, { Request, Response } from 'express';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const pool = new Pool({
  connectionString: `${process.env.DB_CONNECTION}`
});

const router = express.Router();

router
  .get('/list', async (req: Request, res: Response) => {
    try {
      const connection = await pool.connect();
      const query = /* sql */ `
      SELECT u.id, u.first_name, u.last_name, ul.email, u.type, u.approval
      FROM public.users AS u
      JOIN UserLogins AS ul ON u.id = ul.user_id
      WHERE u.approval = 'APPROVED'
      ORDER BY u.id ASC;
        `;
      const { rows } = await connection.query(query);
      connection.release();
      if (rows.length > 0) {
        res.status(200).json({ rows, status: true });
      } else {
        res.status(200).json({ rows: [] });
      }
    } catch (err) {
      console.log(err);
      res.status(500);
    }
  })
  .get('/requests', async (req: Request, res: Response) => {
    try {
      const connection = await pool.connect();
      const query = /* sql */ `
      SELECT u.id, u.first_name, u.last_name, ul.email, u.type, u.approval
      FROM public.users AS u
      JOIN UserLogins AS ul ON u.id = ul.user_id
      WHERE u.approval = 'PENDING'
      ORDER BY u.id ASC;
        `;
      const { rows } = await connection.query(query);
      connection.release();
      if (rows.length > 0) {
        res.status(200).json({ rows, status: true });
      } else {
        res.status(200).json({ rows: [] });
      }
    } catch (err) {
      console.log(err);
      res.status(500).send('Failed to retrieve requests');
    }
  })
  .delete('/delete', async (req: Request, res: Response) => {
    try {
      const { id } = req.body;
      const connection = await pool.connect();
      const deleteMember = /* sql */ `
        DELETE FROM public.UserLogins
        WHERE id = $1
        `;
      await connection.query(deleteMember, [id]);
      connection.release();
      res.status(200).json({ message: 'Member deleted', status: true });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'Failed delete', status: true });
    }
  })
  .patch('/approve', async (req: Request, res: Response) => {
    try {
      const { id } = req.body;
      const connection = await pool.connect();
      const approveMember = /* sql */ `
        UPDATE public.users
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
  });

export default router;
