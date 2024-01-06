import { IRouter } from 'express';
import { Pool } from 'pg';
import path from 'path';
import dotenv from 'dotenv';

export const getMerch = (app: IRouter, db: Pool) => {
  dotenv.config();
  app.get('/', async (req, res) => {
    const query =
      'SELECT id, title, caption, price, image_file, date_last_edit FROM Merch ORDER BY date_last_edit DESC';
    const result = await db.query(query);

    const merch = result.rows.map((item) => {
      const imagePath = `${process.env.BACKEND_CONNECTION}/${path.basename(
        item.image_file
      )}`;

      return {
        id: item.id,
        title: item.title,
        caption: item.caption,
        price: item.price,
        imageSrc: imagePath,
        date: item.date_last_edit
      };
    });

    res.json(merch);
  });

  app.get('/:id', async (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM Merch WHERE id = $1';
    const result = await db.query(query, [id]);

    if (result.rows.length === 0) {
      res.status(404).send({ message: 'Item not found' });
      return;
    }

    const merch = result.rows[0];
    const imagePath = `${process.env.BACKEND_CONNECTION}/${path.basename(
      merch.image_file
    )}`;

    const data = {
      id: merch.id,
      title: merch.title,
      caption: merch.caption,
      imageSrc: imagePath,
      date: merch.date_last_edit
    };

    res.json(data);
  });
};
