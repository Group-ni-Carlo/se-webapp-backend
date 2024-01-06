import { IRouter, Request, Response, NextFunction } from 'express';
import { Pool } from 'pg';
import { Multer } from 'multer';

export const postMerch = (app: IRouter, db: Pool, upload: Multer) => {
  app.post('/create', upload.single('image_file'), async (req, res) => {
    const { title, caption, price } = req.body;
    const imageFile = req.file as Express.Multer.File | undefined;

    try {
      if (!imageFile) {
        res
          .status(400)
          .json({ success: false, error: 'Image file is required.' });
        return;
      }

      const imageFilePath = imageFile.path;

      const result = await db.query(
        'INSERT INTO Merch (title, caption, price, image_file, date_created, date_last_edit, admin_id) VALUES ($1, $2, $3, $4, NOW(), NOW(), $5)',
        [title, caption, Number(price), imageFilePath, 1]
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
