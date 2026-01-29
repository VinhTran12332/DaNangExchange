const crypto = require('crypto');

// HYPERLEDGER FABRIC MOCK ADAPTER
// This service simulates the behavior of Chaincode invocation.
// It acts as a placeholder until the real Hyperledger Fabric SDK is integrated.

class BlockchainService {
    constructor() {
        console.log("[Hyperledger Mock] Service initialized. Ready to simulate Chaincode.");
        this.ledger = []; // In-memory ledger for this session
    }

    /**
     * Simulates "Invoke Chaincode: CreateAsset / LockAsset"
     * @param {string} orderId - The UUID of the order
     * @param {string} buyerId - ID of the buyer
     * @param {number} amount - Amount locked
     */
    async depositToEscrow(orderId, buyerId, amount) {
        console.log(`\n[Hyperledger Mock] Invoking Chaincode: LockAsset...`);
        console.log(`Inputs: { orderId: ${orderId}, buyerId: ${buyerId}, amount: ${amount} }`);

        // Simulate Network Latency (Endorsement Policy)
        await new Promise(resolve => setTimeout(resolve, 500));

        // Generate a Mock Transaction ID (Fabric style is usually 64-char hex)
        const mockTxId = crypto.randomBytes(32).toString('hex');

        // Record to "Ledger"
        const record = {
            txId: mockTxId,
            timestamp: new Date().toISOString(),
            action: 'LOCK_ASSET',
            details: { orderId, amount }
        };
        this.ledger.push(record);

        console.log(`[Hyperledger Mock] Transaction Committed. Orderer response: SUCCESS`);
        console.log(`[Hyperledger Mock] TxID: ${mockTxId}`);

        return mockTxId;
    }
}

module.exports = new BlockchainService();
