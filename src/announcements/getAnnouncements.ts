import { Express } from 'express';
import { Pool } from 'pg';
import path from 'path'

export const getAnnouncements = (app: Express, db: Pool) => {

  app.get('/announcements', async (req, res) => {
    const query = 'SELECT id, title, caption, image_file, date FROM announcements';
    const result = await db.query(query);


    const announcements = result.rows.map(announcement => {
      const imagePath = `http://localhost:3001/${path.basename(announcement.image_file)}`;

      console.log(imagePath)

      return {
        id: announcement.id,
        title: announcement.title,
        caption: announcement.caption,
        imageSrc: imagePath,
        date: announcement.date
      };
    });

    res.json(announcements)
  })
}

