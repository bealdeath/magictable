// C:\Users\Andy\Downloads\testing\my-workspace\apps\api\src\server.ts
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { sequelize } from './models/index';
import authRoutes from './routes/auth';
import dataRoutes from './routes/data';
import userRoutes from './routes/users';
import recordRoutes from './routes/records';

const app = express();
app.use(cors({ origin: 'http://localhost:4200' })); // Ensure CORS is set correctly
app.use(cors());
app.use(express.json());

app.use('/api/auth', (req, res, next) => {
  console.log('Auth routes middleware hit');
  next();
}, authRoutes);

app.use('/api/data', dataRoutes);
app.use('/api/users', userRoutes);
app.use('/api/records', recordRoutes);

sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
    return sequelize.sync();
  })
  .then(() => {
    console.log('Database synchronized.');
  })
  .catch((err: Error) => {
    console.error('Unable to connect to the database:', err);
  });

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
