# 🔌 API Specifications: UGDES Backend

**Protocol:** REST / JSON.
**Auth:** Bearer Token (JWT).

## 1. Authentication (Mock VNeID)
*   `POST /api/auth/login-mock`: Takes `{ "email": "seller@vn.vn", "role": "SELLER" }`. Returns JWT.
*   `GET /api/auth/me`: user profile.

## 2. Market Data (Public)
*   `GET /api/assets`: List assets (Filter by: Price, Category, Tag).
*   `GET /api/assets/{id}`: Detail view (Price, Description, Public Metadata).
    *   *Note: `resource_url` is NEVER returned here.*

## 3. Seller Operations
*   `POST /api/assets`: Create Listing.
    *   Body: `{ title, price, metadata, resource_url (private) }`
*   `PUT /api/assets/{id}/status`: Publish/Unpublish.

## 4. Trade Lifecycle (The Core)

### Step A: Trade Setup
*   `POST /api/orders`: Create intent to buy.
    *   Body: `{ asset_id }`
    *   Response: `{ order_id, escrow_address, amount_required, status: "CREATED" }`
    *   *Action: Buyer uses this info to call SmartContract.deposit()*

### Step B: Sync Status
*   `GET /api/orders/{id}`: Check status.
    *   Status moves to `ESCROW_LOCKED` automatically when Backend detects Blockchain Event.

### Step C: Delivery
*   `POST /api/orders/{id}/delivery`: Request Download Link.
    *   **Pre-condition:** Order Status MUST be `ESCROW_LOCKED` or `DELIVERED`.
    *   Response: `{ temp_download_url: "https://s3.../signed-key", expires_in: "15m" }`
    *   *Side-effect:* Triggers `DELIVERED` status update.

### Step D: Confirmation
*   `POST /api/orders/{id}/confirm`: Buyer confirms data is good.
    *   *Action: Backend calls SmartContract.releaseFunds()* --> Status `COMPLETED`.

## 5. Webhooks / System
*   `POST /internal/blockchain-event`: (Protected) Endpoint for the Listener Script to push events if not using direct DB access.
