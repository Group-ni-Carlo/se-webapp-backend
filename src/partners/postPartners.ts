import { IRouter, Request, Response, NextFunction } from 'express';
import { Pool } from 'pg';
import { Multer } from 'multer';

export const postPartners = (app: IRouter, db: Pool, upload: Multer) => {
  app.post(
    '/admin/create/partners',
    upload.single('logo_file'),
    async (req, res) => {
      const { title } = req.body;
      const logoFile = req.file as Express.Multer.File | undefined;

      try {
        if (!logoFile) {
          res
            .status(400)
            .json({ success: false, error: 'Image file is required.' });
          return;
        }

        const logoFilePath = logoFile.path;

        const result = await db.query(
          'INSERT INTO partners (title, logo_file, date_created, date_last_edit) VALUES ($1, $2 NOW(), NOW())',
          [title, logoFilePath]
        );

        app.use(
          (
            err: Error,
            req: Request,
            res: Response,
            next: NextFunction
          ): void => {
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
        res
          .status(500)
          .json({ success: false, error: 'Internal Server Error' });
      }
    }
  );
};
