// On Vercel, we use relative paths so the Rewrite rules can handle the routing to backend.
// Locally, we might use localhost:3000 if running separate servers, 
// but sticking to /api helps if we use a proxy.
export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const fetchAssets = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/assets`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch assets:", error);
        return [];
    }
};

export const fetchAssetById = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/assets/${id}`);
        if (!response.ok) {
            throw new Error('Asset not found');
        }
        return await response.json();
    } catch (error) {
        console.error(`Failed to fetch asset ${id}:`, error);
        return null; // Return null on error to handle gracefully
    }
};

export const createOrder = async (assetID, quantity = 1) => {
    try {
        const response = await fetch(`${API_BASE_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ asset_id: assetID, quantity: quantity })
        });


        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to create order');
        }
        return await response.json();
    } catch (error) {
        console.error("Create Order Error:", error);
        throw error;
    }
};

export const simulatePayment = async (orderId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/payment/webhook`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                order_id: orderId,
                amount: 100000, // Mock amount
                status: 'SUCCESS',
                signature: 'mock_secure_signature'
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Payment failed');
        }
        return await response.json();
    } catch (error) {
        console.error("Payment Error:", error);
        throw error;
    }
};
