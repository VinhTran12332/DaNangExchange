# Phase 04: Data Watermarking (Security)
Status: ⬜ Pending
Dependencies: Phase 03

## Objective
Nhúng thông tin định danh người mua vào dữ liệu trả về (Digital Seeding) để truy vết rò rỉ.

## Requirements
### Functional
- [ ] Backend: Logic `injectWatermark(data, buyerId)` trước khi trả response.
- [ ] Strategy: Biến đổi nhỏ dữ liệu số hoặc thêm metadata ẩn vào JSON.

### Non-Functional
- [ ] Invisible: Sai lệch dữ liệu phải nằm trong mức chấp nhận được (hoặc không ảnh hưởng logic).

## Implementation Steps
1. [ ] **Backend:** Implement `WatermarkService`.
2. [ ] **Backend:** Tích hợp vào API lấy dữ liệu (`access.routes.js`).
3. [ ] **Demo:** API trả về danh sách user, mỗi người mua sẽ thấy 1 ID ẩn khác nhau.

## Files to Create/Modify
- `backend/src/services/watermark.service.js` - [NEW] Core logic seeding.
- `backend/src/features/access/access.controller.js` - [MODIFY] Apply watermark.

## Test Criteria
- [ ] User A gọi API -> Dữ liệu có dấu hiệu của A.
- [ ] User B gọi API -> Dữ liệu có dấu hiệu của B.

---
End of Plan.
