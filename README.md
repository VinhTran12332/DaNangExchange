# UGDES - Unified Global Data Exchange Standard (POC)

A Hybrid Data Exchange Platform combining Vietnam's operational flow with International governance standards.

## 📂 Structure

- **`/backend`**: Node.js API Service (Identity, Catalog, Matching).
- **`/blockchain`**: Hardhat Project (Escrow Smart Contracts).
- **`/frontend`**: Web Application (React/Next.js) - *Use /visualize to init*.
- **`/docs`**: Project Documentation & Specs.

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- Docker (Optional, for DB/TEE)

### Setup

1.  **Install Backend Dependencies:**
    ```bash
    cd backend
    npm install
    ```

2.  **Install Blockchain Dependencies:**
    ```bash
    cd blockchain
    npm install
    ```

3.  **Run Development:**
    *   Backend: `cd backend && npm run dev`
    *   Blockchain: `cd blockchain && npx hardhat node`

## 📚 Documentation
See `docs/BRIEF.md` for project scope and `docs/specs/` for technical details.
