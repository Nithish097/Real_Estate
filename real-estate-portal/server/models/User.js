import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    // buyer = buyer / tenant, seller = owner / agent, admin = administrator
    role: { type: String, enum: ['buyer', 'seller', 'admin'], default: 'buyer' },
    favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }],
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
