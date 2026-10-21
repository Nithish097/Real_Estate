import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import propertyRoutes from './routes/properties.js';
import favouriteRoutes from './routes/favourites.js';
import inquiryRoutes from './routes/inquiries.js';
import adminRoutes from './routes/admin.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/favourites', favouriteRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/admin', adminRoutes);

// unknown API route
app.use('/api', (req, res) => res.status(404).json({ message: 'API route not found' }));

// central error handler
app.use((err, req, res, next) => {
  console.error(err.message);
  const status = err.name === 'CastError' ? 404 : 500;
  res.status(status).json({ message: status === 404 ? 'Not found' : 'Server error' });
});

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`)))
  .catch((err) => {
    console.error('Could not connect to MongoDB:', err.message);
    console.error('Start MongoDB or correct MONGO_URI in the .env file.');
    process.exit(1);
  });
