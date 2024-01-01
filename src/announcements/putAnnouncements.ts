import { Express, Request, Response, NextFunction } from 'express';
import { Pool } from 'pg';
import { Multer } from 'multer';

export const putAnnouncements = (app: Express, db: Pool, upload: Multer) => {

  app.put('/admin/edit/announcements/:id', upload.single('image_file'), async (req, res) => {
    const { id } = req.params;
    const { title, caption } = req.body;
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
        result = await db.query('UPDATE announcements SET title = $1, caption = $2, date_last_edit = NOW() WHERE id = $3',
          [title, caption, numericId])
      } else {
        imageFilePath = imageFile.path;
        result = await db.query(
          'UPDATE announcements SET title = $1, caption = $2, image_file = $3, date_last_edit = NOW() WHERE id = $4',
          [title, caption, imageFilePath, numericId]
        )
      }

      app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
        if (err) {
          console.error(err.stack)
          res.status(500).send({ error: err.message })
        } else {
          next()
        }
      })
      console.log('Route edit hit!');
      res.status(200).json({ success: true, data: result.rows[0], type: 'PUT' });
    } catch (error) {
      console.log(`Error editing data in the database: ${error}`);
      res.status(500).json({ success: false, error: 'Internal Server Error' })
    }
  })
}
