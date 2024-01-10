import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const databaseConnection = new Pool({
  connectionString: `${process.env.DB_CONNECTION}`
});
