import mongoose from 'mongoose';

// Connects the application to MongoDB using the MONGO_URI from the .env file
const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
  console.log('MongoDB connected');
};

export default connectDB;
