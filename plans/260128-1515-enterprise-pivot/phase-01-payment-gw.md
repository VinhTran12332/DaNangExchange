# Phase 01: Payment Simulation (Fiat)
Status: ⬜ Pending
Dependencies: None

## Objective
Xây dựng luồng thanh toán giả lập (Fiat/VND) để thay thế luồng Crypto.

## Requirements
### Functional
- [ ] Admin/Dev Page: Nút "Simulate Bank Transfer" để giả lập Webhook từ ngân hàng.
- [ ] Backend: API endpoint nhận Webhook thanh toán (`POST /api/payment/webhook`).
- [ ] Database: Cập nhật trạng thái đơn hàng từ `CREATED` -> `PAID`.

### Non-Functional
- [ ] Security: Webhook nên có signature giả lập để bảo mật (cho thói quen tốt).

## Implementation Steps
1. [ ] **Backend:** Tạo `payment.routes.js` và `payment.controller.js`.
2. [ ] **Backend:** Implement `handleWebhook` logic: Check Order -> Update Status -> Trigger Blockchain (Mock).
3. [ ] **Frontend:** Tạo trang `/dev/payment-simulation`.
4. [ ] **Frontend:** Form nhập Order ID + Amount + Nút "Send Fake Success".

## Files to Create/Modify
- `backend/src/features/payment/payment.routes.js` - [NEW] Payment routes.
- `backend/src/features/payment/payment.controller.js` - [NEW] Logic xử lý thanh toán.
- `frontend/src/pages/DevPayment.jsx` - [NEW] Trang giả lập cho Dev.

## Test Criteria
- [ ] Nhập Order ID -> Bấm Simulate -> Backend trả về 200 OK.
- [ ] Check Database: Order `status` = `PAID`.

---
Next Phase: [Phase 02: Hyperledger Mock Adapter](phase-02-hyperledger-mock.md)
