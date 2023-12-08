import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import multer from 'multer';

const pool = new Pool({
  user: 'jedmamosto',
  host: 'singapore-postgres.render.com',
  database: 'jed_sewebapp_personal',
  password: 'goDs9uechBjlbzatPwooBoTSq8mWfDP4',
  port: 5432,
  ssl: true,
});

const app = express();

const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

pool.connect()
  .then(() => {
    console.log('Connected to PostgreSQL');
  })
  .catch((error) => {
    console.error('Error connecting to PostgreSQL:', error);
    process.exit(1);
  });

app.post('/announcement/post', upload.none(), async (req, res) => {
  console.log('Route is being hit!');
  const { title, caption, image_file, date_of_post } = req.body;
  console.log('Received data:', req.body);

  try {
    const result = await pool.query(
      'INSERT INTO announcements (title, caption, image_file, date_of_post) VALUES ($1, $2, $3, $4)',
      [title, caption, image_file, date_of_post]
    );

    res.status(201).json({ message: 'Announcement created successfully', result });
  } catch (error) {
    console.error('Error inserting data into PostgreSQL:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}, go to http://localhost:3001`);
});
