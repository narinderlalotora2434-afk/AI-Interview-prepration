import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import interviewRoutes from './routes/interview';
import resumeRoutes from './routes/resume';
import userRoutes from './routes/user';
import codingRoutes from './routes/coding';
import challengeRoutes from './routes/challenges';
import aptitudeRoutes from './routes/aptitude';
import roadmapsRoutes from './routes/roadmaps';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/user', userRoutes);
app.use('/api/coding', codingRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/aptitude', aptitudeRoutes);
app.use('/api/roadmaps', roadmapsRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
