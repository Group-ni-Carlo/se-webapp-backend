import { IRouter, Request, Response, NextFunction } from 'express';
import { Pool } from 'pg';

export const orderMerch = (app: IRouter, db: Pool) => {
  app.post('/order', async (req, res) => {
    const { merchId, buyerName, buyerSize } = req.body;

    try {
      const result = await db.query(
        'INSERT INTO Orders (merch_id, buyer_name, size) VALUES ($1, $2, $3)',
        [merchId, buyerName, buyerSize]
      );

      app.use(
        (err: Error, req: Request, res: Response, next: NextFunction): void => {
          if (err) {
            console.error(err.stack);
            res.status(500).send({ error: err.message });
          } else {
            next();
          }
        }
      );

      console.log('Route create hit!');
      res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error) {
      console.log(`Error inserting data into the database: ${error}`);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  });
};
