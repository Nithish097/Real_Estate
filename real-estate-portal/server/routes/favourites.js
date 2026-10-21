import express from 'express';
import User from '../models/User.js';
import Property from '../models/Property.js';
import { protect } from '../middleware/auth.js';
import asyncHandler from '../middleware/asyncHandler.js';

const router = express.Router();
router.use(protect);

// GET /api/favourites  -> saved properties of the logged in user
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).populate({
      path: 'favourites',
      match: { status: 'approved' },
    });
    res.json(user.favourites);
  })
);

// GET /api/favourites/ids  -> only the ids (used to colour the heart icons)
router.get(
  '/ids',
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    res.json(user.favourites.map(String));
  })
);

// POST /api/favourites/:propertyId  -> add or remove (toggle)
router.post(
  '/:propertyId',
  asyncHandler(async (req, res) => {
    const property = await Property.findById(req.params.propertyId);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    const user = await User.findById(req.user._id);
    const id = String(property._id);
    const has = user.favourites.map(String).includes(id);
    user.favourites = has
      ? user.favourites.filter((f) => String(f) !== id)
      : [...user.favourites, property._id];
    await user.save();
    res.json({ saved: !has, ids: user.favourites.map(String) });
  })
);

export default router;
