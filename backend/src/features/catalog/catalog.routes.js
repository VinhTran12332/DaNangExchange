const express = require('express');
const router = express.Router();
const catalogController = require('./catalog.controller');
const authMiddleware = require('../../middleware/auth.middleware');

// Public
router.get('/', catalogController.listAssets);
router.get('/:id', catalogController.getAssetDetail);

// Protected (Seller)
router.post('/', authMiddleware, catalogController.createAsset);

module.exports = router;
