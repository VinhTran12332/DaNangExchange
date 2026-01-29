const express = require('express');
const router = express.Router();
const { verifyTokenAndQuota } = require('../../middleware/quota.middleware');
const AccessController = require('./access.controller');

// Protected Data Access Endpoint
// Watermark is now applied inside the controller
router.get('/data/:assetId', verifyTokenAndQuota, AccessController.getAssetData);

module.exports = router;
