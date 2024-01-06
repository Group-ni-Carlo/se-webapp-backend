import { IRouter, Request, Response, NextFunction } from 'express';
import { Pool } from 'pg';
import { Multer } from 'multer';

export const putMerch = (app: IRouter, db: Pool, upload: Multer) => {
  app.put('/edit/:id', upload.single('image_file'), async (req, res) => {
    const { id } = req.params;
    const { title, caption, price } = req.body;
    const imageFile = req.file as Express.Multer.File | undefined;

    try {
      let result;
      let imageFilePath;

      const numericId = Number(id);

      if (isNaN(numericId)) {
        res.status(400).json({ success: false, error: 'Invalid ID provided.' });
        return;
      }

      if (!imageFile) {
        result = await db.query(
          'UPDATE Merch SET title = $1, caption = $2, price = $3, date_last_edit = NOW() WHERE id = $4',
          [title, caption, Number(price), numericId]
        );
      } else {
        imageFilePath = imageFile.path;
        result = await db.query(
          'UPDATE Merch SET title = $1, caption = $2, price = $3, image_file = $4, date_last_edit = NOW() WHERE id = $5',
          [title, caption, Number(price), imageFilePath, numericId]
        );
      }

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
      console.log('Route edit hit!');
      res.status(200).json({
        success: true,
        data: result.rows[0],
        type: 'PUT'
      });
    } catch (error) {
      console.log(`Error editing data in the database: ${error}`);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  });
};
