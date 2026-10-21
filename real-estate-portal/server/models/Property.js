import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    listingType: { type: String, enum: ['sale', 'rent'], required: true },
    propertyType: {
      type: String,
      enum: ['Apartment', 'House', 'Villa', 'Plot', 'Studio'],
      required: true,
    },
    price: { type: Number, required: true, min: 0 },
    city: { type: String, required: true, trim: true },
    address: { type: String, default: '' },
    bedrooms: { type: Number, default: 0 },
    bathrooms: { type: Number, default: 0 },
    area: { type: Number, default: 0 }, // square feet
    amenities: [{ type: String }],
    imageUrl: { type: String, default: '' },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    // new listings wait for admin approval
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  },
  { timestamps: true }
);

export default mongoose.model('Property', propertySchema);
