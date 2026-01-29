const db = require('../db');

exports.verifyTokenAndQuota = async (req, res, next) => {
    try {
        const token = req.headers['x-api-key'];
        console.log(`[QuotaMiddleware] Verifying Token: '${token}'`);

        if (!token) {
            console.log("[QuotaMiddleware] ❌ Missing API Key");
            return res.status(401).json({ error: 'Missing API Key (x-api-key)' });
        }

        // 1. Check Token Existence and Quota
        const result = await db.query(
            "SELECT * FROM access_tokens WHERE token = ?",
            [token]
        );

        if (result.rows.length === 0) {
            console.log("[QuotaMiddleware] ❌ Invalid API Key (Not found in DB)");
            return res.status(403).json({ error: 'Invalid API Key' });
        }

        const tokenData = result.rows[0];
        console.log(`[QuotaMiddleware] Found Token for Order ${tokenData.order_id}. Remaining: ${tokenData.remaining_quota}`);

        if (tokenData.remaining_quota <= 0) {
            console.log("[QuotaMiddleware] ❌ Quota Exceeded (<= 0)");
            return res.status(403).json({ error: 'Quota Exceeded. Please buy a new license.' });
        }

        // 2. Decrement Quota (Atomic Update)
        await db.query(
            "UPDATE access_tokens SET remaining_quota = remaining_quota - 1 WHERE token = ?",
            [token]
        );

        // 3. Attach info to request for downstream use
        req.access = {
            orderId: tokenData.order_id,
            remainingQuota: tokenData.remaining_quota - 1
        };

        console.log(`[Quota] Access granted for Order ${tokenData.order_id}. Remaining: ${req.access.remainingQuota}`);
        next();

    } catch (error) {
        console.error("Quota Middleware Error:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
