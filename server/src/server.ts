import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import surahRoutes from './routes/surah.routes';
import morgan from 'morgan'
import redisClient from './config/redis';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

redisClient.on("connect", () => {
  console.log("Redis client connected");
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"))

// Routes
app.use('/api/surahs', surahRoutes);

// Test route
app.get('/', (req: Request, res: Response) => {
  res.send('Islamic App API is running!');
});

// Start server
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
