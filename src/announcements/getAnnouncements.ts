import { Express } from 'express';
import { Pool } from 'pg';
import path from 'path'

export const getAnnouncements = (app: Express, db: Pool) => {

  app.get('/announcements', async (req, res) => {
    const query = 'SELECT id, title, caption, image_file, date_last_edit FROM announcements ORDER BY date_last_edit DESC';
    const result = await db.query(query);

    const announcements = result.rows.map(announcement => {
      const imagePath = `http://localhost:3001/${path.basename(announcement.image_file)}`;

      return {
        id: announcement.id,
        title: announcement.title,
        caption: announcement.caption,
        imageSrc: imagePath,
        date: announcement.date_last_edit
      };
    });

    res.json(announcements)
  })

  app.get('/announcements/:id', async (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM announcements WHERE id = $1';
    const result = await db.query(query, [id]);

    if (result.rows.length === 0) {
      res.status(404).send({ message: 'Announcement not found' });
      return;
    }

    const announcement = result.rows[0];
    const imagePath = `http://localhost:3001/${path.basename(announcement.image_file)}`;

    const data = {
      id: announcement.id,
      title: announcement.title,
      caption: announcement.caption,
      imageSrc: imagePath,
      date: announcement.date_last_edit
    };

    res.json(data);
  });

}

