import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import authRoutes from './routers/authRouters.mjs';
import apiRoutes from './routers/apiRouters.mjs';
import paymentRoutes from './routers/paymentRoutes.mjs';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  ...(process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map((origin) => origin.trim())
    : []),
];

// ✅ CORS Configuration untuk support credentials
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server tools (no Origin header) and configured browser origins.
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));
// Perbaiki static path agar lebih aman
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use('/public', express.static(path.join(__dirname, 'public')));

// Jalankan rute
app.use('/api/auth', authRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api', apiRoutes);
// ... sisanya

// Di index.mjs setelah app.use("/api", apiRoutes);
console.log('--- DAFTAR RUTE TERDETEKSI ---');
apiRoutes.stack.forEach((layer) => {
  if (layer.route) {
    console.log(
      `${Object.keys(layer.route.methods).join(',').toUpperCase()} -> /api${layer.route.path}`
    );
  }
});

app.use((req, res) => {
  res.status(404).json({
    status: false,
    message: `Rute ${req.originalUrl} tidak ditemukan!`,
  });
});

app.listen(port, () => {
  console.log(`[Backend] Server jalan di http://localhost:${port}`);
});
