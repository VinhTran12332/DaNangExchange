const db = require('../../db');
const crypto = require('crypto');

// 1. Create Listing
exports.createAsset = async (req, res) => {
    try {
        const { title, description, price, metadata, resource_url, source_url } = req.body;
        const sellerId = req.user.id; // From Auth Middleware

        // Support both old resource_url and new source_url
        const finalSourceUrl = source_url || resource_url;

        if (!title || !price || !finalSourceUrl) {
            return res.status(400).json({ error: 'Missing required fields (title, price, source_url)' });
        }

        const newId = crypto.randomUUID();

        // Auto-detect type
        let sourceType = 'DIRECT_LINK';
        if (finalSourceUrl.includes('drive.google.com')) sourceType = 'GOOGLE_DRIVE';

        await db.query(
            `INSERT INTO assets (id, seller_id, title, description, price, metadata, resource_url, source_url, source_type, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'PUBLISHED')`,
            [newId, sellerId, title, description, price, JSON.stringify(metadata || {}), finalSourceUrl, finalSourceUrl, sourceType]
        );

        res.status(201).json({
            message: 'Asset listed successfully',
            asset_id: newId
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// 2. List Public Assets
exports.listAssets = async (req, res) => {
    try {
        const result = await db.query(
            `SELECT id, seller_id, title, price, currency, preview_url, status 
       FROM assets 
       WHERE status = 'PUBLISHED' 
       ORDER BY created_at DESC`
        );
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// 3. Get Asset Detail
exports.getAssetDetail = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db.query(
            `SELECT id, seller_id, title, description, price, currency, metadata, preview_url, status, created_at 
       FROM assets WHERE id = ?`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Asset not found' });
        }

        // Note: NOT returning resource_url
        const asset = result.rows[0];
        try {
            asset.metadata = JSON.parse(asset.metadata); // Parse JSON string back to obj
        } catch (e) { }

        res.json(asset);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
