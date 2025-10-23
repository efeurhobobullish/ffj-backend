import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieSession from 'cookie-session';
import passport from 'passport';
import http from 'http';
import { Server as IOServer } from 'socket.io';

import connectDB from './utils/connectDB.js';
import initPassport from './config/passport.js';

import authRoutes from './routes/authRoutes.js';
import menuRoutes from './routes/menuRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();
const server = http.createServer(app);
const io = new IOServer(server, {
  cors: { origin: process.env.FRONTEND_URL || '*', methods: ['GET','POST'] }
});

// Connect DB + init passport
await connectDB();
initPassport();

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || '*', credentials: true }));
app.use(express.json());

// cookie session for passport
app.use(cookieSession({
  name: 'session',
  keys: [process.env.COOKIE_KEY || 'ffj_secret_key'],
  maxAge: 24 * 60 * 60 * 1000
}));

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRoutes);
app.use('/menu', menuRoutes);
app.use('/orders', orderRoutes);
app.use('/admin', adminRoutes);

// Basic health
app.get('/health', (_req, res) => res.json({ ok: true }));

// --- Socket.IO: rider <-> customer live updates ---
// We'll use rooms named `order:<orderId>`
io.on('connection', (socket) => {
  // join a room to watch an order (customer)
  socket.on('joinOrder', ({ orderId }) => {
    if (!orderId) return;
    socket.join(`order:${orderId}`);
  });

  // rider joins order room when they accept it, to broadcast to customer
  socket.on('joinAsRider', ({ orderId, riderId }) => {
    if (!orderId) return;
    socket.join(`order:${orderId}`);
  });

  // rider emits location updates — broadcast to customers in same room
  socket.on('riderLocation', ({ orderId, lat, lng }) => {
    if (!orderId) return;
    const payload = { orderId, lat, lng, ts: Date.now() };
    // Broadcast to clients in room (customers)
    io.to(`order:${orderId}`).emit('riderLocation', payload);
  });

  // optionally, rider can emit 'statusUpdate' to notify customers
  socket.on('statusUpdate', ({ orderId, status }) => {
    if (!orderId) return;
    io.to(`order:${orderId}`).emit('orderStatus', { orderId, status });
  });

  socket.on('disconnect', () => { /* handle if needed */ });
});

// Expose socket.io server instance via app (so controllers can emit if needed)
app.set('io', io);

// Start server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
