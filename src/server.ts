import http from 'http';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { connectDB } from './config/database';
import { initSocket } from './socket';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Route imports
import authRoutes from './routes/authRoutes';
import jobRoutes from './routes/jobRoutes';
import userRoutes from './routes/userRoutes';
import applicationRoutes from './routes/applicationRoutes';
import notificationRoutes from './routes/notificationRoutes';

const app = express();

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: false, // Fix for Render
}));
app.use(compression());
app.use(cors({
  origin: '*', // Allow all origins (change in production)
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/users', userRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check endpoints (both /health and /api/health)
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running', timestamp: new Date().toISOString() });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'UP', message: 'API is live', timestamp: new Date().toISOString() });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    name: 'MKSof Job Search Portal API',
    version: '1.0.0',
    status: 'Active',
    endpoints: {
      auth: '/api/auth',
      jobs: '/api/jobs',
      users: '/api/users',
      applications: '/api/applications',
      notifications: '/api/notifications',
      health: '/health'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.url}`
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Something went wrong!',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io (if you have)
initSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`API: http://localhost:${PORT}/api/health`);
});