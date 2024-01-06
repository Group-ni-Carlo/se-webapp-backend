import { IRouter } from 'express';
import { Pool } from 'pg';

export const deleteMerch = (app: IRouter, db: Pool) => {
  app.delete('/delete/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await db.query('DELETE FROM Merch where id = $1', [id]);
      res.status(200).send('Merch deleted successfully.');
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error.');
    }
  });
};
