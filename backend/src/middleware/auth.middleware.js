module.exports = (req, res, next) => {
    // Mock Auth for MVP: Always assume User is logged in as Seller-1
    req.user = {
        id: 'seller-001',
        email: 'seller@ugdes.com',
        role: 'SELLER'
    };
    next();
};
