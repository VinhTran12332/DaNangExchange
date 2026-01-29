const express = require('express');
const router = express.Router();
const hyperledgerService = require('./hyperledger.service');

// Get Audit Trail for an Order
router.get('/history/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;
        const history = await hyperledgerService.queryHistory(orderId);
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch ledger history' });
    }
});

// Get Latest Blocks (Explorer View)
router.get('/blocks/latest', async (req, res) => {
    try {
        const db = require('../../db');
        const result = await db.query(
            "SELECT * FROM ledger_transactions ORDER BY timestamp DESC LIMIT 20"
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch latest blocks' });
    }
});

module.exports = router;
