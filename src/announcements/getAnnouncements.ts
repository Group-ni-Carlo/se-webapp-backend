import { IRouter } from 'express';
import { Pool } from 'pg';
import path from 'path';
import dotenv from 'dotenv';

export const getAnnouncements = (app: IRouter, db: Pool) => {
  dotenv.config();
  app.get('/', async (req, res) => {
    const query =
      'SELECT id, title, caption, image_file, date_last_edit FROM announcements ORDER BY date_last_edit DESC';
    const result = await db.query(query);

    const announcements = result.rows.map((announcement) => {
      const imagePath = `${process.env.BACKEND_CONNECTION}/${path.basename(
        announcement.image_file
      )}`;

      return {
        id: announcement.id,
        title: announcement.title,
        caption: announcement.caption,
        imageSrc: imagePath,
        date: announcement.date_last_edit
      };
    });

    res.json(announcements);
  });

  app.get('/:id', async (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM announcements WHERE id = $1';
    const result = await db.query(query, [id]);

    if (result.rows.length === 0) {
      res
        .status(404)
        .send({ message: 'Announcement not found' })
        .json({ status: true });
      return;
    }

    const announcement = result.rows[0];
    const imagePath = `${process.env.BACKEND_CONNECTION}/${path.basename(
      announcement.image_file
    )}`;

    const data = {
      id: announcement.id,
      title: announcement.title,
      caption: announcement.caption,
      imageSrc: imagePath,
      date: announcement.date_last_edit
    };

    res.json(data);
  });
};
