const db = require('../../db');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

exports.mockLogin = async (req, res) => {
    try {
        const { email, role } = req.body;

        // 1. Check if user exists
        let user = await db.query('SELECT * FROM users WHERE email = ?', [email]);

        if (user.rows.length === 0) {
            // Create new mock user
            const newId = crypto.randomUUID();
            const demoWallet = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';

            await db.query(
                `INSERT INTO users (id, email, role, kyc_status, full_name, wallet_address) 
         VALUES (?, ?, ?, 'VERIFIED_VNEID', ?, ?)`,
                [newId, email, role || 'BUYER', `Mock User (${email})`, demoWallet]
            );

            // Fetch back to return
            user = await db.query('SELECT * FROM users WHERE id = ?', [newId]);
            user = user.rows[0];
        } else {
            user = user.rows[0];
        }

        // 2. Generate Token
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '1d' }
        );

        res.json({
            message: 'Mock Login Successful',
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                kyc_status: user.kyc_status
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
