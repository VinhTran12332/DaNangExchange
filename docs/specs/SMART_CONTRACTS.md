# 📜 Smart Contract Specs: UGDES Trust Layer

**Network:** EVM Compatible (Ethereum/Polygon/Local Hardhat).
**Language:** Solidity ^0.8.20.

## 1. Overview
The Blockchain layer acts as the **"Trust Anchor"**. It does not store large data. It stores:
1.  **Escrow State:** Who deposited, how much, for which Order.
2.  **Proof of Delivery (Hash):** Immutable log of what was delivered.

## 2. Contracts

### 2.1. `UGDES_Escrow.sol`
Managing the "Money Flow" (Tiền trao cháo múc).

#### State Variables
```solidity
enum OrderState { CREATED, LOCKED, RELEASED, REFUNDED, DISPUTED }

struct EscrowTx {
    address buyer;
    address seller;
    uint256 amount;
    uint256 lockedAt;
    OrderState state;
}

mapping(bytes32 => EscrowTx) public escrows; // orderId -> Data
address public owner; // System Admin (Oracle)
```

#### Functions

**1. `deposit(bytes32 orderId, address seller)`**
*   **Caller:** Buyer.
*   **Value:** Must match Order/Asset price (in Native Token or Stablecoin).
*   **Logic:**
    *   Verify `msg.value > 0`.
    *   Create `EscrowTx` with state `LOCKED`.
    *   Emit `FundsLocked(orderId, buyer, amount)`.

**2. `releaseFunds(bytes32 orderId)`**
*   **Caller:** System Oracle (onlyOwner for MVP) - triggered when Buyer confirms receipt or System detects download.
*   **Logic:**
    *   Check state is `LOCKED`.
    *   Transfer `amount * 98%` to `seller`.
    *   Transfer `amount * 2%` to `treasury` (Fee).
    *   Set state `RELEASED`.
    *   Emit `FundsReleased(orderId, seller)`.

**3. `refundBuyer(bytes32 orderId)`**
*   **Caller:** System Oracle (Dispute resolution).
*   **Logic:**
    *   Check state `LOCKED` or `DISPUTED`.
    *   Transfer `amount` back to `buyer`.
    *   Set state `REFUNDED`.

### 2.2. `UGDES_Audit.sol` (Optional for Step 12)
Simple log for non-financial events.
*   `logAction(bytes32 entityId, string actionCode, string ipHash)`

## 3. Events & Indexing
The Backend (Node.js) will listen to these events to update the `orders` table in SQL.

*   `event FundsLocked(bytes32 indexed orderId, address indexed buyer, uint256 amount);`
*   `event FundsReleased(bytes32 indexed orderId, address indexed seller);`

## 4. Security Considerations
*   **Reentrancy Guard:** Apply to all withdrawal functions.
*   **Access Control:** strict `onlyOwner` for the Oracle release function in the POC phase. In Production, this would be a Multi-sig or Decentralized Oracle.
