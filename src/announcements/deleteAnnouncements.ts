import { Express } from "express";
import { Pool } from "pg";

export const deleteAnnouncements = (app: Express, db: Pool) => {

  app.delete('/admin/delete/announcements/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await db.query('DELETE FROM announcements where id = $1', [id]);
      res.status(200).send('Announcement deleted successfully.')
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error.')
    }
  })

}