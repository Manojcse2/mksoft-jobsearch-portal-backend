import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import jwt from 'jsonwebtoken';
import { User } from './models/User';

let io: SocketIOServer | null = null;

export const initSocket = (server: http.Server) => {
  io = new SocketIOServer(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    const token = socket.handshake.auth?.token as string | undefined;

    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return next(new Error('Authentication error'));
      }

      socket.data.userId = user._id.toString();
      socket.join(user._id.toString());
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log('Socket connected', socket.id, 'user:', socket.data.userId);

    socket.on('disconnect', () => {
      console.log('Socket disconnected', socket.id);
    });
  });

  return io;
};

export const getSocket = () => io;
