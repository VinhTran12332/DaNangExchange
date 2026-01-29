# Phase 02: Hyperledger Mock Adapter
Status: ⬜ Pending
Dependencies: Phase 01

## Objective
Xây dựng Adapter giả lập hành vi của Hyperledger Fabric để thay thế module Ethers.js hiện tại. Đảm bảo input/output giống Chaincode thật.

## Requirements
### Functional
- [ ] Backend: `HyperledgerService` thay thế `BlockchainService`.
- [ ] Database: Bảng `ledger_logs` để lưu lịch sử giao dịch (Audit Trail).
- [ ] Logic: Hàm `invokeChaincode(function, args)` xử lý các lệnh: `InitAsset`, `TransferAsset`.

### Non-Functional
- [ ] Architecture: Adapter Pattern - Dễ dàng swap sang SDK thật sau này.

## Implementation Steps
1. [ ] **Database:** Tạo bảng `ledger_transactions` (mock blockchain ledger).
2. [ ] **Backend:** Tạo `features/hyperledger/hyperledger.service.js`.
3. [ ] **Backend:** Implement hàm `recordTransaction(orderId, buyerId, assetId)`.
4. [ ] **Refactor:** Cập nhật `orders.controller.js` gọi `HyperledgerService` thay vì `BlockchainService`.

## Files to Create/Modify
- `backend/src/features/hyperledger/hyperledger.service.js` - [NEW] Mock Adapter.
- `backend/src/db/schema.sql` (hoặc tương đương) - [MODIFY] Thêm bảng ledger.
- `backend/src/features/orders/orders.controller.js` - [MODIFY] Switch service.

## Test Criteria
- [ ] Tạo đơn hàng -> Payment Success -> Ledger ghi log transaction.
- [ ] API trả về `tx_id` (dạng UUID giả lập hash).

---
Next Phase: [Phase 03: Usage Rights](phase-03-usage-rights.md)
