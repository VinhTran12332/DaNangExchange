const db = require('../../db');
const crypto = require('crypto');

// HYPERLEDGER FABRIC MOCK ADAPTER v1.0
// This service simulates the behavior of Chaincode invocation and persists audit trails to SQLite.
// It effectively replaces the transient memory-only mock involved in Phase 1.

class HyperledgerService {
    constructor() {
        console.log("[Hyperledger Service] Initialized. Ready to persist to 'ledger_transactions'.");
        this.currentBlockNumber = 1000; // Mock starting block
    }

    /**
     * Simulates "Invoke Chaincode" and records the transaction immutably.
     * @param {string} functionName - Chaincode function (e.g., 'LockAsset')
     * @param {string} orderId - The UUID of the order
     * @param {Object} args - Function arguments
     */
    async invokeChaincode(functionName, orderId, args) {
        console.log(`\n[Hyperledger Mock] Invoking Chaincode: ${functionName}...`);
        const startTime = Date.now();

        // 1. Simulate Endorsement Policy Latency (Consensus)
        await new Promise(resolve => setTimeout(resolve, 300));

        // 2. Generate Fabric-like Transaction ID
        const txId = crypto.randomBytes(32).toString('hex');
        this.currentBlockNumber++;

        // 3. Persist to Mock Ledger (SQLite)
        // In real Fabric, this happens after Orderer commits the block.
        const payload = JSON.stringify(args);

        try {
            await db.query(`
                INSERT INTO ledger_transactions (id, order_id, buyer_id, action_type, payload, block_number)
                VALUES (?, ?, ?, ?, ?, ?)
            `, [
                txId,
                orderId,
                args.buyerId || 'anonymous',
                functionName.toUpperCase(),
                payload,
                this.currentBlockNumber
            ]);

            console.log(`[Hyperledger Mock] Transaction Committed!`);
            console.log(`   TxID: ${txId}`);
            console.log(`   Block: ${this.currentBlockNumber}`);
            console.log(`   Latency: ${Date.now() - startTime}ms`);

            return {
                txId: txId,
                blockNumber: this.currentBlockNumber,
                status: 'VALID'
            };

        } catch (error) {
            console.error("[Hyperledger Mock] Failed to commit transaction:", error);
            throw new Error("Ledger Commit Failed");
        }
    }

    /**
     * Query the Ledger History for an Asset/Order (Audit Trail)
     */
    async queryHistory(orderId) {
        try {
            const result = await db.query(
                "SELECT * FROM ledger_transactions WHERE order_id = ? ORDER BY timestamp ASC",
                [orderId]
            );
            return result.rows;
        } catch (error) {
            console.error("Ledger Query Failed:", error);
            return [];
        }
    }
}

module.exports = new HyperledgerService();
