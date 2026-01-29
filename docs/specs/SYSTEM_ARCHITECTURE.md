# 🏗️ System Architecture: UGDES POC

**Pattern:** Modular Monolith (for POC) -> Microservices (Target)
**Core Tech:** Node.js (Main Logic), Python (Data Processing), PostgreSQL (Data), EVM (Trust).

## 1. High-Level Architecture (The 4 Layers)

The system follows the 4-layer model defined in `BRIEF.md`:

```mermaid
graph TD
    subgraph Layer1_User["Layer 1: User & Interface"]
        WebApp["Web App (React/Vue)"]
        Wallet["Crypto Wallet (Metamask/Rabby)"]
    end

    subgraph Layer2_Catalog["Layer 2: Catalog & Business"]
        API["API Gateway (Express/NestJS)"]
        Auth["Identity Module (Mock VNeID)"]
        Catalog["Catalog Module (Listing/Search)"]
    end

    subgraph Layer3_Trust["Layer 3: Trust & Governance"]
        OrderManager["Order Matching Engine"]
        SmartContract["Escrow Smart Contract (EVM)"]
    end

    subgraph Layer4_Execution["Layer 4: Execution & Data"]
        Delivery["Secure Delivery Service"]
        MockTEE["Mock TEE (Docker Worker)"]
        DB[(PostgreSQL)]
    end

    WebApp --> API
    WebApp --> Wallet
    Wallet --> SmartContract
    API --> Auth
    API --> Catalog
    API --> OrderManager
    OrderManager --> SmartContract : Listen Events
    OrderManager --> Delivery : Trigger Release
    Delivery --> MockTEE : Execute Data
    Delivery --> DB : Read Encrypted URL
```

## 2. Component Responsibilities

### 2.1. Backend API (Node.js)
*   **Identity:** Manage Users, Mock KYC status.
*   **Catalog:** CRUD Assets, Search, Metadata handling.
*   **Trade:** Handle Order creation (`CREATED`), listen to Blockchain events to update status (`ESCROW_LOCKED`), and trigger delivery (`DELIVERING`).

### 2.2. Blockchain (Simulated or Local Hardhat)
*   **Escrow Contract:**
    *   `deposit(orderId)`: Buyer locks money. Status -> LOCKED.
    *   `release(orderId)`: Seller/System confirms delivery. Money -> Seller.
    *   `refund(orderId)`: Dispute resolved favor Buyer. Money -> Buyer.

### 2.3. Delivery Service (Python/Node)
*   Generates **Temporary Signed URLs** (AWS S3 Presigned or similar logic) for the buyer to download data.
*   Or runs a script in Docker (Mock TEE) if the asset type is "Compute-to-Data".

## 3. Sequence Diagram: The 12-Step Trade Flow

Mapping the UGDES 12-steps to technical interactions.

```mermaid
sequenceDiagram
    autonumber
    actor Buyer
    actor Seller
    participant API as Backend API
    participant DB as Database
    participant SC as Smart Contract (Escrow)
    participant Delivery as Delivery Service

    Note over Buyer, Seller: PRE-TRADE (Steps 1-3)
    Seller->>API: 1. Login & KYC (Mock)
    Seller->>API: 2-3. Create Listing (Price, Metadata)
    API->>DB: Save Asset (Status: PUBLISHED)

    Note over Buyer, Seller: TRADE SETUP (Steps 4-6)
    Buyer->>API: Search & View Asset
    Buyer->>API: 5. Place Order (Agree Policy)
    API->>DB: Create Order (Status: CREATED)
    API-->>Buyer: Return OrderID & Smart Contract Info
    Buyer->>SC: 6. Deposit Funds (Escrow Lock)
    SC-->>API: Event: FundsLocked(orderId)

    Note over API, SC: EXECUTION (Steps 7-9)
    API->>DB: Update Order (Status: ESCROW_LOCKED)
    API->>Delivery: 8. Trigger Delivery (Validate Order)
    Delivery->>Delivery: Generate Access Token / Link
    Delivery-->>API: Delivery Info Ready
    API->>DB: Update Order (Status: DELIVERED)
    API-->>Buyer: Notification: "Data Ready"

    Note over Buyer, Seller: POST-TRADE (Steps 10-12)
    Buyer->>API: 9. Access/Download Data (Consumes Token)
    Buyer->>API: Confirm Receipt (Or Auto-confirm after 24h)
    API->>SC: 11. Trigger Settlement (Release Funds)
    SC->>Seller: Transfer Crypto/Tokens
    API->>DB: 12. Update Order (Status: COMPLETED) & Log Audit
```

## 4. Key Design Decisions (Mock vs Real)
For POC Phase:
1.  **Blockchain Listener:** Instead of a complex Indexer (The Graph), we will use a simple **Polling/WebSocket** script in Node.js to listen for `FundsLocked` events from the local chain.
2.  **File Storage:** Use Local Filesystem or generic S3 for asset storage. `resource_url` in DB points to this.
