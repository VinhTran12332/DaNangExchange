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

// DEBUG LOGGING
app.use((req, res, next) => {
    console.log(`[DEBUG] ${req.method} ${req.url}`);
    next();
});

// Routes
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
    res.json({ message: 'UGDES API Gateway v1.0' });
});

const initDatabase = require('./src/db/init_db');

// Start Server
const startServer = async () => {
    try {
        await initDatabase(); // Initialize SQLite Schema

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
