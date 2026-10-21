import express from 'express';
import Property from '../models/Property.js';
import { protect, allow } from '../middleware/auth.js';
import asyncHandler from '../middleware/asyncHandler.js';

const router = express.Router();

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// GET /api/properties?city=&propertyType=&listingType=&maxPrice=&beds=&sort=&page=
// Public search: only approved listings are returned
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { city, propertyType, listingType, maxPrice, beds, sort = 'newest' } = req.query;
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 9, 30);

    const filter = { status: 'approved' };
    if (city) filter.city = new RegExp(escapeRegex(city), 'i');
    if (propertyType) filter.propertyType = propertyType;
    if (listingType) filter.listingType = listingType;
    if (maxPrice) filter.price = { $lte: Number(maxPrice) };
    if (beds) filter.bedrooms = { $gte: Number(beds) };

    const sortOptions = {
      newest: { createdAt: -1 },
      price_asc: { price: 1 },
      price_desc: { price: -1 },
    };

    const total = await Property.countDocuments(filter);
    const items = await Property.find(filter)
      .sort(sortOptions[sort] || sortOptions.newest)
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({ items, total, page, pages: Math.max(Math.ceil(total / limit), 1) });
  })
);

// GET /api/properties/mine  -> listings of the logged in seller (all statuses)
router.get(
  '/mine',
  protect,
  allow('seller', 'admin'),
  asyncHandler(async (req, res) => {
    const items = await Property.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json(items);
  })
);

// GET /api/properties/:id
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const property = await Property.findById(req.params.id).populate('owner', 'name email');
    if (!property || property.status !== 'approved') {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.json(property);
  })
);

// POST /api/properties  -> seller or admin posts a listing (waits for admin approval)
router.post(
  '/',
  protect,
  allow('seller', 'admin'),
  asyncHandler(async (req, res) => {
    const { title, listingType, propertyType, price, city } = req.body;
    if (!title || !listingType || !propertyType || !price || !city) {
      return res.status(400).json({ message: 'Title, type, price and city are required' });
    }
    if (Number(price) <= 0) {
      return res.status(400).json({ message: 'Price must be greater than zero' });
    }
    const { status, owner, ...data } = req.body; // owner and status are set by the server
    const property = await Property.create({
      ...data,
      owner: req.user._id,
      status: req.user.role === 'admin' ? 'approved' : 'pending',
    });
    res.status(201).json(property);
  })
);

// PUT /api/properties/:id  -> owner edits a listing (it goes back to pending)
router.put(
  '/:id',
  protect,
  allow('seller', 'admin'),
  asyncHandler(async (req, res) => {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    if (String(property.owner) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You can edit only your own listings' });
    }
    const { status, owner, ...changes } = req.body; // status and owner cannot be changed here
    Object.assign(property, changes);
    if (req.user.role !== 'admin') property.status = 'pending';
    await property.save();
    res.json(property);
  })
);

// DELETE /api/properties/:id
router.delete(
  '/:id',
  protect,
  allow('seller', 'admin'),
  asyncHandler(async (req, res) => {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    if (String(property.owner) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You can delete only your own listings' });
    }
    await property.deleteOne();
    res.json({ message: 'Listing deleted' });
  })
);

export default router;
