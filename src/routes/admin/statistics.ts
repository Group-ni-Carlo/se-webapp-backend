import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';

import { filterSettings } from '../../utils/filterSettings';
import { databaseConnection as pool } from '../../utils/pool';
import { MerchProps } from '../../utils/merchProps';

const router = express.Router();
dotenv.config();
router
  .use(express.static('uploads'))
  .get('/list/:id', async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const connection = await pool.connect();
      const { rows } = await connection.query(filterSettings.get(Number(id)));
      connection.release();

      const merch = rows.map((item: MerchProps) => {
        const imagePath = `${process.env.BACKEND_CONNECTION}/${path.basename(
          item.image_file
        )}`;

        return {
          id: item.id,
          title: item.title,
          revenue: item.revenue,
          sales: item.sales,
          price: item.price,
          imageSrc: imagePath
        };
      });

      if (rows.length > 0) {
        res.status(200).json(merch);
      } else {
        res.status(200).json([]);
      }
    } catch (err) {
      console.log(err);
      res.status(404).json([]);
    }
  })
  .get('/revenue', async (req: Request, res: Response) => {
    try {
      const getRevenue =
        /* sql */
        `SELECT SUM(m.price * o.merch_id) AS revenue
    FROM Orders AS o
    INNER JOIN Merch AS m ON o.merch_id = m.id`;
      const connection = await pool.connect();
      const { rows } = await connection.query(getRevenue);
      connection.release();
      if (rows.length > 0) {
        res.status(200).json(rows[0]);
      } else {
        res.status(200).json(0);
      }
    } catch (err) {
      console.log(err);
      res.status(404).json(0);
    }
  })
  .get('/sales', async (req: Request, res: Response) => {
    try {
      const connection = await pool.connect();
      const getSales =
        /* sql */
        `SELECT COUNT(*) as sales FROM Orders`;
      const { rows } = await connection.query(getSales);
      connection.release();
      if (rows.length > 0) {
        res.status(200).json(rows[0]);
      } else {
        res.status(200).json(0);
      }
    } catch (err) {
      console.log(err);
      res.status(400).json(0);
    }
  });

export default router;
