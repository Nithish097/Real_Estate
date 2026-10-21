import express from 'express';
import Inquiry from '../models/Inquiry.js';
import Property from '../models/Property.js';
import { protect, allow } from '../middleware/auth.js';
import asyncHandler from '../middleware/asyncHandler.js';

const router = express.Router();
router.use(protect);

// POST /api/inquiries  -> send an inquiry to the owner of a property
router.post(
  '/',
  asyncHandler(async (req, res) => {
    const { propertyId, message } = req.body;
    if (!propertyId || !message || !message.trim()) {
      return res.status(400).json({ message: 'Please write a message' });
    }
    const property = await Property.findById(propertyId);
    if (!property || property.status !== 'approved') {
      return res.status(404).json({ message: 'Property not found' });
    }
    if (String(property.owner) === String(req.user._id)) {
      return res.status(400).json({ message: 'You cannot send an inquiry to your own listing' });
    }
    const inquiry = await Inquiry.create({
      property: property._id,
      buyer: req.user._id,
      owner: property.owner,
      message,
    });
    res.status(201).json(inquiry);
  })
);

// GET /api/inquiries/sent  -> inquiries sent by the logged in user
router.get(
  '/sent',
  asyncHandler(async (req, res) => {
    const items = await Inquiry.find({ buyer: req.user._id })
      .populate('property', 'title city')
      .populate('owner', 'name')
      .sort({ createdAt: -1 });
    res.json(items);
  })
);

// GET /api/inquiries/received  -> inquiries for the logged in seller's properties
router.get(
  '/received',
  allow('seller', 'admin'),
  asyncHandler(async (req, res) => {
    const items = await Inquiry.find({ owner: req.user._id })
      .populate('property', 'title city')
      .populate('buyer', 'name email')
      .sort({ createdAt: -1 });
    res.json(items);
  })
);

// PUT /api/inquiries/:id/reply  -> seller replies to an inquiry
router.put(
  '/:id/reply',
  allow('seller', 'admin'),
  asyncHandler(async (req, res) => {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry || String(inquiry.owner) !== String(req.user._id)) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }
    if (!req.body.reply || !req.body.reply.trim()) {
      return res.status(400).json({ message: 'Reply cannot be empty' });
    }
    inquiry.reply = req.body.reply;
    inquiry.status = 'replied';
    await inquiry.save();
    res.json(inquiry);
  })
);

export default router;
