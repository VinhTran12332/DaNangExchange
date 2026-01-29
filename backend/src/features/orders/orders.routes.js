const express = require('express');
const router = express.Router();
const ordersController = require('./orders.controller');
// IMPORTANT: Basic Auth Middleware for POC
const authMiddleware = (req, res, next) => {
    // For POC, we skip real JWT check and just inject a mock user
    req.user = { id: 'demo-buyer-123', role: 'buyer' };
    next();
};

router.post('/', authMiddleware, ordersController.createOrder);
router.get('/:id/access', authMiddleware, ordersController.getOrderAccess);


module.exports = router;
