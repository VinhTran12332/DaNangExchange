require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// DEBUG MIDDLEWARE: Log every request
app.use((req, res, next) => {
    console.log(`[VERCEL-DEBUG] Method: ${req.method}, URL: ${req.url}, Path: ${req.path}`);
    next();
});

// Routes
const authRoutes = require('./src/features/identity/auth.routes');
const catalogRoutes = require('./src/features/catalog/catalog.routes');
const orderRoutes = require('./src/features/orders/orders.routes');
const paymentRoutes = require('./src/features/payment/payment.routes');
const hyperledgerRoutes = require('./src/features/hyperledger/hyperledger.routes');
const accessRoutes = require('./src/features/access/access.routes');

app.use('/api/auth', authRoutes);
app.use('/api/assets', catalogRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/hyperledger', hyperledgerRoutes);
app.use('/api/access', accessRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'UGDES API Gateway v1.0', originalUrl: req.originalUrl });
});

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', mode: 'Serverless', db: 'InMemory', time: new Date().toISOString() });
});

const initDatabase = require('./src/db/init_db');

// GLOBAL 404 HANDLER (Force JSON)
app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: 'The requested API route was not found.',
        debug: {
            url: req.url,
            method: req.method,
            path: req.path
        }
    });
});

// Start Server or Export for Vercel
if (process.env.VERCEL) {
    // Lazy Init: Don't await DB at startup. Let it init in background or on first query.
    // This avoids cold start timeouts.
    console.log('[VERCEL] Starting in Serverless Mode');
    initDatabase().catch(err => console.error("DB Init Failed:", err));
    module.exports = app;
} else {
    // Local Mode
    const startServer = async () => {
        try {
            await initDatabase();
            app.listen(PORT, () => {
                console.log(`Server running on port ${PORT}`);
            });
        } catch (error) {
            console.error('Failed to start server:', error);
            process.exit(1);
        }
    };
    startServer();
}
