import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema(
  {
    property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true, trim: true },
    reply: { type: String, default: '' },
    status: { type: String, enum: ['pending', 'replied'], default: 'pending' },
  },
  { timestamps: true }
);

export default mongoose.model('Inquiry', inquirySchema);
