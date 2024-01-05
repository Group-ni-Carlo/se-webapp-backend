import { Express } from 'express';
import { Pool } from 'pg';
import path from 'path';
import dotenv from 'dotenv';

export const getPartners = (app: Express, db: Pool) => {
  app.get('/partners', async (req, res) => {
    dotenv.config();
    const query =
      'SELECT id, title, logo_file, date_last_edit FROM partners ORDER BY date_last_edit DESC';
    const result = await db.query(query);

    const partners = result.rows.map((partner) => {
      const logoPath = `${process.env.BACKEND_CONNECTION}/${path.basename(
        partner.logo_file
      )}`;

      return {
        id: partner.id,
        title: partner.title,
        logoSrc: logoPath,
        date: partner.date_last_edit
      };
    });

    res.json(partners);
  });

  app.get('/partners/:id', async (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM partners WHERE id = $1';
    const result = await db.query(query, [id]);

    if (result.rows.length === 0) {
      res.status(404).send({ message: 'Partner not found' });
      return;
    }

    const partner = result.rows[0];
    const logoPath = `${process.env.BACKEND_CONNECTION}/${path.basename(
      partner.logo_file
    )}`;

    const data = {
      id: partner.id,
      title: partner.title,
      logoSrc: logoPath,
      date: partner.date_last_edit
    };

    res.json(data);
  });
};
