import express from 'express';
import cors from 'cors';

const startServer = async () => {
  const app = express();

  app
    .use(cors())
    .get(`/members/list`, async (req, res) => {
      const data: [{ name: string; year: string; email: string }] = [
        {
          name: 'aj',
          year: '2nd',
          email: 'aj@cpu.edu.ph'
        }
      ];
      console.log(data);
      res.status(200).json(data);
    })
    .listen(5000, () => {
      console.log('Server started at https://localhost:5000');
    });
};

startServer();
