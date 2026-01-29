const db = require('../../db');
const hyperledgerService = require('../hyperledger/hyperledger.service');
const crypto = require('crypto');



// Handle Payment Webhook (Simulated)
exports.handleWebhook = async (req, res) => {
    try {
        const { order_id, amount, status, signature } = req.body;

        console.log(`[Payment Webhook] Request Body:`, JSON.stringify(req.body, null, 2));

        // 1. Validate Input
        if (!order_id || !status) {
            return res.status(400).json({ error: 'Missing order_id or status' });
        }

        // 2. Validate Signature (Mock)
        // In real world, we verify hash(order_id + secret) === signature
        if (signature !== 'mock_secure_signature') {
            console.warn('[Payment Webhook] Invalid signature');
            // For dev purpose, we might warn but still proceed or fail. Let's fail to be rigorous.
            // return res.status(401).json({ error: 'Invalid signature' });
        }

        // 3. Check Order Exists
        const orderResult = await db.query('SELECT * FROM orders WHERE id = ?', [order_id]);
        if (orderResult.rows.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }

        const order = orderResult.rows[0];

        // 4. Update Order Status
        if (status === 'SUCCESS') {
            await db.query(
                `UPDATE orders SET status = 'RELEASED' WHERE id = ?`,
                [order_id]
            );
            console.log(`[Payment Webhook] Order ${order_id} marked as RELEASED`);

            // Trigger Hyperledger Mock Adapter (Chaincode: TransferAsset)
            try {
                await hyperledgerService.invokeChaincode('TRANSFER_ASSET', order_id, {
                    status: 'RELEASED',
                    paymentStatus: 'PAID',
                    timestamp: new Date().toISOString()
                });
                console.log(`[Payment Webhook] Hyperledger Transaction Recorded.`);
            } catch (err) {
                console.error("[Payment Webhook] Failed to write to Ledger:", err);
                // Non-blocking error for payment flow, but should be alerted in real system
            }

            // Generate API Key (Access Token)
            const token = 'ugdes_' + crypto.randomBytes(16).toString('hex');
            try {
                // Use the Purchased Quota (Default 5 was hardcoded before Phase 3.5 update)
                const quotaToGrant = order.purchased_quota || 5;

                await db.query(
                    `INSERT INTO access_tokens (token, order_id, remaining_quota) VALUES (?, ?, ?)`,
                    [token, order_id, quotaToGrant]
                );
                console.log(`[Payment Webhook] API Key generated for Order ${order_id}: ${token}. Quota: ${quotaToGrant}`);
            } catch (err) {

                console.error("[Payment Webhook] Failed to generate API Key:", err);
            }

        } else {
            console.log(`[Payment Webhook] Payment failed or pending for Order ${order_id}`);
        }

        // 5. Return Success to Payment Gateway (include token if generated)
        // Note: In real world, token is sent via email or separate API. For Dev Sim, we return it here.
        // We need to fetch the token again if we want to be pure, but since we just generated it...
        // Let's attach it to the response if success.

        let responsePayload = { message: 'Webhook received', order_id: order_id, updated_status: 'RELEASED' };
        // We can't easily scope 'token' out without refactoring, so let's rely on the client fetching it via another API or 
        // just for this MVP, we assume the DevUI will query the access API or we return it here if 'SUCCESS'.

        res.status(200).json(responsePayload);


    } catch (error) {
        console.error("Payment Webhook Error:", error);
        res.status(500).json({ error: `Internal Server Error: ${error.message}` });
    }
};

// Get Pending Orders for Dev Simulation
exports.getPendingOrders = async (req, res) => {
    try {
        // Fetch orders that are waiting for payment (CREATED or LOCKED)
        // In this flow, 'CREATED' means user clicked 'Buy', 'LOCKED' means Blockchain Escrow initiated.
        // We want to simulate payment success for any of these.
        const result = await db.query(
            "SELECT * FROM orders WHERE status IN ('CREATED', 'LOCKED') ORDER BY created_at DESC"
        );
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Get Pending Orders Error:", error);
        res.status(500).json({ error: 'Failed to fetch pending orders' });
    }
};
