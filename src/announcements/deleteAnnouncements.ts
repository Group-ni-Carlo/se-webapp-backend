import { IRouter } from 'express';
import { Pool } from 'pg';

export const deleteAnnouncements = (app: IRouter, db: Pool) => {
  app.delete('/delete/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await db.query('DELETE FROM announcements where id = $1', [id]);
      res
        .status(200)
        .send('Announcement deleted successfully.')
        .json({ status: true });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error.').json({ status: true });
    }
  });
};
