import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { createServer } from 'http';
import { Server } from 'socket.io';
import winston from 'winston';

import authRoutes from './routes/auth';
import aiRoutes from './routes/ai';
import communityRoutes from './routes/community';
import placesRoutes from './routes/places';
import emergencyRoutes from './routes/emergency';
import settingsRoutes from './routes/settings';
import web3Routes from './routes/web3';
import healthRoutes from './routes/health';
import uploadRoutes from './routes/upload';

import { initializeDatabase } from './database/init';
import { errorHandler, notFoundHandler } from './middleware/errorHandlers';
import { authMiddleware } from './middleware/auth';
import { loggerMiddleware } from './middleware/logger';

dotenv.config();

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'welltick-backend' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true
  }
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "wss:", "https:"],
    },
  },
}));

app.use(limiter);
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors({ 
  origin: process.env.FRONTEND_URL, 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(loggerMiddleware(logger));

app.get('/', (req, res) => res.json({ 
  status: 'Welltick API running',
  version: '1.0.0',
  timestamp: new Date().toISOString()
}));

app.get('/health', (req, res) => res.json({ 
  status: 'healthy',
  timestamp: new Date().toISOString(),
  uptime: process.uptime()
}));

app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/community', authMiddleware, communityRoutes);
app.use('/api/places', placesRoutes);
app.use('/api/emergency', emergencyRoutes);
app.use('/api/settings', authMiddleware, settingsRoutes);
app.use('/api/web3', web3Routes);
app.use('/api/health', healthRoutes);
app.use('/api/upload', authMiddleware, uploadRoutes);
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use(notFoundHandler);
app.use(errorHandler);

io.on('connection', (socket) => {
  logger.info(`User connected: ${socket.id}`);
  
  socket.on('join-community', (communityId) => {
    socket.join(`community-${communityId}`);
    logger.info(`User ${socket.id} joined community ${communityId}`);
  });

  socket.on('emergency-alert', (alertData) => {
    io.emit('emergency-broadcast', {
      ...alertData,
      timestamp: new Date().toISOString()
    });
    logger.warn(`Emergency alert from ${socket.id}:`, alertData);
  });

  socket.on('disconnect', () => {
    logger.info(`User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await initializeDatabase();
    logger.info('Database initialized successfully');
    
    server.listen(PORT, () => {
      logger.info(`Backend running on http://localhost:${PORT}`);
      console.log(`🚀 Welltick Backend running on http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
  });
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

startServer();

export { io, logger };