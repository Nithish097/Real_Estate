// Run with:  npm run seed
// Creates demo users and sample properties so that the portal is not empty.
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import User from './models/User.js';
import Property from './models/Property.js';
import Inquiry from './models/Inquiry.js';

dotenv.config();

const run = async () => {
  await connectDB();
  await Promise.all([User.deleteMany(), Property.deleteMany(), Inquiry.deleteMany()]);

  const hash = await bcrypt.hash('password123', 10);
  const admin = await User.create({ name: 'Admin', email: 'admin@realestate.com', password: await bcrypt.hash('admin123', 10), role: 'admin' });
  const seller = await User.create({ name: 'Ravi Kumar', email: 'seller@realestate.com', password: hash, role: 'seller' });
  await User.create({ name: 'Meena Buyer', email: 'buyer@realestate.com', password: hash, role: 'buyer' });

  const img = (n) => `https://picsum.photos/seed/realestate${n}/800/500`;
  const base = { owner: seller._id, status: 'approved' };
  const amenities = ['Parking', 'Lift', 'Security', 'Power Backup'];

  await Property.insertMany([
    { ...base, title: '3 BHK Apartment', listingType: 'sale', propertyType: 'Apartment', price: 4500000, city: 'Salem', address: 'Fairlands, Salem', bedrooms: 3, bathrooms: 2, area: 1450, amenities, imageUrl: img(1), description: 'Well-maintained apartment close to schools and hospitals.' },
    { ...base, title: '2 BHK Flat', listingType: 'rent', propertyType: 'Apartment', price: 18000, city: 'Salem', address: 'Ammapet, Salem', bedrooms: 2, bathrooms: 2, area: 980, amenities: ['Parking', 'Security'], imageUrl: img(2), description: 'Bright flat with good ventilation, ready to move in.' },
    { ...base, title: 'Independent Villa', listingType: 'sale', propertyType: 'Villa', price: 9800000, city: 'Coimbatore', address: 'Saibaba Colony, Coimbatore', bedrooms: 4, bathrooms: 3, area: 2800, amenities: [...amenities, 'Garden'], imageUrl: img(3), description: 'Spacious villa with a private garden and covered parking.' },
    { ...base, title: '1 BHK Studio', listingType: 'rent', propertyType: 'Studio', price: 9500, city: 'Chennai', address: 'Velachery, Chennai', bedrooms: 1, bathrooms: 1, area: 520, amenities: ['Lift', 'Security'], imageUrl: img(4), description: 'Compact studio near the metro station.' },
    { ...base, title: 'Residential Plot', listingType: 'sale', propertyType: 'Plot', price: 3200000, city: 'Salem', address: 'Kondalampatti, Salem', bedrooms: 0, bathrooms: 0, area: 2400, amenities: [], imageUrl: img(5), description: 'East facing plot in a developing residential layout.' },
    { ...base, title: '3 BHK Independent House', listingType: 'sale', propertyType: 'House', price: 6250000, city: 'Madurai', address: 'Anna Nagar, Madurai', bedrooms: 3, bathrooms: 3, area: 1900, amenities: ['Parking', 'Power Backup'], imageUrl: img(6), description: 'Independent house with a large terrace.' },
    { owner: seller._id, status: 'pending', title: '2 BHK Villa (waiting for approval)', listingType: 'rent', propertyType: 'Villa', price: 25000, city: 'Salem', address: 'Hasthampatti, Salem', bedrooms: 2, bathrooms: 2, area: 1200, amenities: ['Parking'], imageUrl: img(7), description: 'This listing is pending so that you can try the admin approval.' },
  ]);

  console.log('Seed complete.');
  console.log('  Admin : admin@realestate.com  / admin123');
  console.log('  Seller: seller@realestate.com / password123');
  console.log('  Buyer : buyer@realestate.com  / password123');
  await mongoose.disconnect();
};

run().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
