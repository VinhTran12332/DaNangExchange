# System Architecture (Enterprise Pivot)

**Status:** Implemented (v0.8)
**Date:** 2026-01-30

## 1. High-Level Diagram

```mermaid
graph TD
    User[User (Enterprise Buyer/Seller)] -->|HTTP/HTTPS| FE[Frontend (React + Vite)]
    FE -->|REST API| BE[Backend (Node.js Express)]
    
    subgraph "Core Backend"
        BE -->|Auth| ID[Identity Module (Mock VNeID)]
        BE -->|CRUD| CAT[Catalog Module]
        BE -->|Broker| FETCH[Source Fetcher (Google Drive)]
        BE -->|Security| PIPE[Watermark Pipeline]
    end
    
    subgraph "Data Layer"
        CAT -->|SQL| DB[(SQLite/Postgres)]
        FETCH -->|Stream| EXT[External Storage (Drive/S3)]
        BE -->|Audit| BC[Hyperledger Fabric (Mock Adapter)]
    end
    
    subgraph "Trust Layer"
        BC -- Transactions --> LEDGER[Immutable Ledger]
    end
```

## 2. Component Details

### Frontend (`/frontend`)
*   **Tech:** React, TailwindCSS (Fintech Theme).
*   **Role:** Marketplace Interface, Seller Dashboard, Admin Portal.
*   **Current State:** Home Policy, Checkout Flow, Seller Portal.

### Backend (`/backend`)
*   **Tech:** Node.js, Express.
*   **Role:** Trusted Broker (No Data Storage).
*   **Modules:**
    *   **Identity:** Mock JWT login with Role-based Access (Buyer/Seller/Admin).
    *   **Catalog:** Manage Asset Metadata & Source Links.
    *   **Watermark:** Inject Buyer ID into JSON/Excel on-the-fly (`xlsx` library).
    *   **Source Fetcher:** Securely stream data from Seller's source (e.g., Google Drive).
    *   **Blockchain Adapter:** Abstracted Interface for Hyperledger Fabric.

### Database (`ugdes.db`)
*   **Tech:** SQLite (Dev).
*   **Tables:** `users`, `assets`, `orders`, `access_tokens`, `ledger_transactions`.

### Blockchain (`/blockchain-mock`)
*   **Tech:** In-Memory / File-based Mock for Hyperledger Fabric.
*   **Role:** Audit Trail for every transaction (Purchase, Access).

## 3. Data Flow (Enterprise Broker Model)
1.  **Onboarding:** Seller links Google Drive file via **Seller Portal**.
2.  **Purchase:** Buyer pays (Fiat Sim) -> Order created -> Transaction logged on **Ledger**.
3.  **Access:** Buyer requests Download.
4.  **Brokerage:** 
    *   Backend checks Quota & Rights.
    *   **Source Fetcher** streams file from Google Drive.
    *   **Watermark Service** injects Buyer Metadata (Trace ID) into stream.
5.  **Delivery:** Secure file streamed to Buyer (Server stores nothing).
