import { IRouter } from 'express';
import { Pool } from 'pg';

export const deletePartners = (app: IRouter, db: Pool) => {
  app.delete('/admin/:id', async (req, res) => {
    const { id } = req.params;
    try {
      await db.query('DELETE FROM partners where id = $1', [id]);
      res.status(200).send('Partner deleted successfully.');
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error.');
    }
  });
};
