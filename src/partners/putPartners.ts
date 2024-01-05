import { Express, Request, Response, NextFunction } from 'express';
import { Pool } from 'pg';
import { Multer } from 'multer';

export const putPartners = (app: Express, db: Pool, upload: Multer) => {
  app.put(
    '/admin/edit/partners/:id',
    upload.single('logo_file'),
    async (req, res) => {
      const { id } = req.params;
      const { title } = req.body;
      const logoFile = req.file as Express.Multer.File | undefined;

      try {
        let result;
        let logoFilePath;

        const numericId = Number(id);

        if (isNaN(numericId)) {
          res
            .status(400)
            .json({ success: false, error: 'Invalid ID provided.' });
          return;
        }

        if (!logoFile) {
          result = await db.query(
            'UPDATE partners SET title = $1 date_last_edit = NOW() WHERE id = $2',
            [title, numericId]
          );
        } else {
          logoFilePath = logoFile.path;
          result = await db.query(
            'UPDATE partners SET title = $1 logo_file = $2, date_last_edit = NOW() WHERE id = $3',
            [title, logoFilePath, numericId]
          );
        }

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

        console.log('Route edit hit!');
        res
          .status(200)
          .json({ success: true, data: result.rows[0], type: 'PUT' });
      } catch (error) {
        console.log(`Error editing data: ${error}`);
        res
          .status(500)
          .json({ success: false, error: 'Internal Server Error' });
      }
    }
  );
};
