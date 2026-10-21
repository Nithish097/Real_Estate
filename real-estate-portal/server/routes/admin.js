import express from 'express';
import User from '../models/User.js';
import Property from '../models/Property.js';
import Inquiry from '../models/Inquiry.js';
import { protect, allow } from '../middleware/auth.js';
import asyncHandler from '../middleware/asyncHandler.js';

const router = express.Router();
router.use(protect, allow('admin'));

// GET /api/admin/stats
router.get(
  '/stats',
  asyncHandler(async (req, res) => {
    const [totalListings, pendingListings, users, inquiries] = await Promise.all([
      Property.countDocuments({ status: 'approved' }),
      Property.countDocuments({ status: 'pending' }),
      User.countDocuments(),
      Inquiry.countDocuments(),
    ]);
    res.json({ totalListings, pendingListings, users, inquiries });
  })
);

// GET /api/admin/pending  -> listings waiting for approval
router.get(
  '/pending',
  asyncHandler(async (req, res) => {
    const items = await Property.find({ status: 'pending' })
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });
    res.json(items);
  })
);

// PUT /api/admin/properties/:id/status   body: { status: "approved" | "rejected" }
router.put(
  '/properties/:id/status',
  asyncHandler(async (req, res) => {
    const { status } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be approved or rejected' });
    }
    const property = await Property.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.json(property);
  })
);

// GET /api/admin/users
router.get(
  '/users',
  asyncHandler(async (req, res) => {
    res.json(await User.find().select('-password -favourites').sort({ createdAt: -1 }));
  })
);

export default router;
