const express = require('express');
const router = express.Router();
const paymentController = require('./payment.controller');

// Simulated Webhook Endpoint
router.post('/webhook', paymentController.handleWebhook);

// Get Pending Orders (Dev Helper)
router.get('/pending', paymentController.getPendingOrders);

module.exports = router;
