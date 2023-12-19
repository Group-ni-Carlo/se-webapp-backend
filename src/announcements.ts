import express from 'express';
import cors from 'cors';
import multer from 'multer';
import db from '../db/dbConnection';

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

db.connect()
  .then(() => {
    console.log('Connected to PostgreSQL');
  })
  .catch((error) => {
    console.error('Error connecting to PostgreSQL:', error);
    process.exit(1);
  });

app.post('/admin/create-announcements', upload.single('image_file'), async (req, res) => {
  console.log('Route is being hit!');
  const { title, caption, date_of_post } = req.body;

  try {
    if (!req.file) {
      console.log('no image file')
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const image_file = req.file.buffer;

    console.log('Received data:', req.body);

    const result = await db.query(
      'INSERT INTO announcements (title, caption, image_file, date_of_post) VALUES ($1, $2, $3, $4)',
      [title, caption, image_file, date_of_post]
    );

    res.status(201).json({ message: 'Announcement created successfully', result });
    console.log('Announcement created succesfully')
  } catch (error) {
    console.error('Error inserting data into PostgreSQL:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


app.get('/announcements/:id', async (req, res) => {
  const { id } = req.params;
  const query = 'SELECT title, caption, image_file FROM announcements WHERE id = $1';
  const result = await db.query(query, [id]);

  const announcement = result.rows[0];
  const imageBuffer = announcement.image_file;

  res.writeHead(200, {
    'Content-Type': 'image/*',
    'Content-Length': imageBuffer.length,
  });
  res.end(imageBuffer);
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}, go to http://localhost:3001`);
});
