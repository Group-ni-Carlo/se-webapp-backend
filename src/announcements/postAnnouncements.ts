import { Express, Request, Response, NextFunction } from 'express';
import { Pool } from 'pg';
import { Multer } from 'multer';

export const postAnnouncements = (app: Express, db: Pool, upload: Multer) => {


  app.post('/admin/create/announcements', upload.single('image_file'), async (req, res) => {
    const { title, caption } = req.body;
    const imageFile = req.file as Express.Multer.File | undefined;

    try {
      if (!imageFile) {
        res.status(400).json({ success: false, error: 'Image file is required.' });
        return;
      }

      const imageFilePath = imageFile.path;

      const result = await db.query(
        'INSERT INTO announcements (title, caption, image_file, date) VALUES ($1, $2, $3, NOW())',
        [title, caption, imageFilePath]
      )

      app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
        if (err) {
          console.error(err.stack)
          res.status(500).send({ error: err.message })
        } else {
          next()
        }
      })

      console.log('Route hit!')
      res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error) {
      console.log(`Error inserting data into the database: ${error}`);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  })
}

