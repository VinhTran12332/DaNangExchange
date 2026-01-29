# Phase 03: Usage Rights (Quota System)
Status: ⬜ Pending
Dependencies: Phase 02

## Objective
Kiểm soát quyền sử dụng dữ liệu thông qua API Key và cơ chế Quota (mua bao nhiêu dùng bấy nhiêu).

## Requirements
### Functional
- [ ] Database: Bảng `access_tokens` (token, order_id, remaining_quota).
- [ ] Backend: Middleware `verifyTokenAndQuota` để chặn truy cập nếu hết lượt.
- [ ] Backend: API `GET /api/data/:assetId` để lấy dữ liệu (được bảo vệ bởi middleware).

### Non-Functional
- [ ] Performance: Check quota nhanh, atomic update (tránh race condition).

## Implementation Steps
1. [ ] **Database:** Tạo bảng `access_tokens`.
2. [ ] **Backend:** Service tạo token khi Order thành công (`PaymentController`).
3. [ ] **Backend:** Middleware kiểm tra token & trừ quota.
4. [ ] **Backend:** API Endpoint trả về dữ liệu mẫu (để test watermark ở phase sau).

## Files to Create/Modify
- `backend/src/middleware/quota.middleware.js` - [NEW] Access control logic.
- `backend/src/features/access/access.routes.js` - [NEW] Data access routes.

## Test Criteria
- [ ] Gọi API với token đúng -> Trả về data, quota giảm 1.
- [ ] Gọi API khi quota = 0 -> Trả về 403 Forbidden.

---
Next Phase: [Phase 04: Data Watermarking](phase-04-watermarking.md)
