const db = require('../../db');
const crypto = require('crypto');
const hyperledgerService = require('../hyperledger/hyperledger.service');


// Create Order (Protected)
exports.createOrder = async (req, res) => {
    try {
        const { asset_id, quantity = 1 } = req.body; // Default quantity 1

        // In a real app, buyer_id comes from req.user.id set by auth middleware
        // For POC, if auth middleware is not fully enforcing, we mock or require it.
        // Assuming req.user exists from previous mock auth flow
        const buyerId = req.user ? req.user.id : 'test-buyer-id';

        if (!asset_id) {
            return res.status(400).json({ error: 'Missing asset_id' });
        }

        // 1. Verify Asset exists and is PUBLISHED
        const assetResult = await db.query(
            `SELECT * FROM assets WHERE id = ? AND status = 'PUBLISHED'`,
            [asset_id]
        );

        if (assetResult.rows.length === 0) {
            return res.status(404).json({ error: 'Asset not found or not available' });
        }

        const asset = assetResult.rows[0];
        const unitPrice = asset.price;
        const amount = unitPrice * quantity;
        const newOrderId = crypto.randomUUID();


        // 2. Create Order
        await db.query(
            `INSERT INTO orders (id, buyer_id, asset_id, amount, status, purchased_quota)
             VALUES (?, ?, ?, ?, 'CREATED', ?)`,
            [newOrderId, buyerId, asset_id, amount, quantity]
        );


        // 3. [NEW] Blockchain Interaction (Hyperledger Fabric Mock)
        console.log("Initiating Hyperledger Chaincode: LockAsset...");

        const chaincodeResponse = await hyperledgerService.invokeChaincode('LOCK_ASSET', newOrderId, {
            assetId: asset_id,
            buyerId: buyerId,
            amount: amount,
            quantity: quantity,
            currency: 'VND'
        });


        const txHash = chaincodeResponse.txId;


        // 4. Update Order Status
        await db.query(
            `UPDATE orders SET status = 'LOCKED', tx_hash = ? WHERE id = ?`,
            [txHash, newOrderId]
        );

        // 5. Return Success
        res.status(201).json({
            message: 'Order created & Escrow locked successfully',
            order_id: newOrderId,
            amount: amount,
            tx_hash: txHash,
            status: 'LOCKED',
            next_step: 'Asset Release'
        });

    } catch (error) {
        console.error("Create Order Error:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get Access Info (API Key) for an Order
exports.getOrderAccess = async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Verify Order is PAID/RELEASED
        const orderResult = await db.query("SELECT * FROM orders WHERE id = ?", [id]);
        if (orderResult.rows.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }
        const order = orderResult.rows[0];

        if (order.status !== 'RELEASED' && order.status !== 'PAID') { // Accept both for robustness
            return res.status(403).json({ error: 'Order not yet paid/released.' });
        }

        // 2. Fetch API Key
        const tokenResult = await db.query("SELECT * FROM access_tokens WHERE order_id = ?", [id]);

        if (tokenResult.rows.length === 0) {
            return res.status(404).json({ error: 'Access token not generated yet.' });
        }

        const tokenData = tokenResult.rows[0];

        res.json({
            order_id: id,
            api_key: tokenData.token,
            remaining_quota: tokenData.remaining_quota,
            asset_link: `/api/access/data/${order.asset_id}`
        });

    } catch (error) {
        console.error("Get Order Access Error:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

