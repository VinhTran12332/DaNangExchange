# 💡 BRIEF: UGDES - Enterprise Pivot

**Ngày tạo:** 2026-01-28
**Brainstorm cùng:** Vibe Coder
**Status:** Strategic Pivot Execution

---

## 1. VẤN ĐỀ CẦN GIẢI QUYẾT
- **Pháp lý:** Việt Nam không cho phép thanh toán bằng Crypto -> Cần dùng Fiat (VND).
- **Tuân thủ:** Ethereum (Public) không đảm bảo KYC/Audit theo tiêu chuẩn Quốc gia -> Cần Hyperledger Fabric (Permissioned).
- **Bảo mật:** Dữ liệu bán ra dễ bị rò rỉ -> Cần cơ chế Watermarking & truy vết.
- **MVP Speed:** Cần demo nhanh mà không phụ thuộc hạ tầng phức tạp.

## 2. GIẢI PHÁP ĐỀ XUẤT (HYBRID ARCHITECTURE)
- **Payment:** Giả lập Banking Transfer (Webhook Simulation).
- **Blockchain:** "Mock Hyperledger Adapter" (Giả lập Logic Hyperledger trên Database thường cho MVP).
- **Access Control:** API Key + Token Quota (Mua bao nhiêu dùng bấy nhiêu).
- **Security:** Digital Seeding (Watermarking) cho dữ liệu API/Excel.

## 3. ĐỐI TƯỢNG SỬ DỤNG
- **Primary:** Các doanh nghiệp/tổ chức cần mua/bán dữ liệu chính thống.
- **Secondary:** Nhà nước/Cơ quan quản lý (Audit node).

## 4. TÍNH NĂNG (ENTERPRISE PIVOT)

### 🚀 MVP (Triển khai ngay):
- [ ] **Payment Simulation:** Nút "Test Bank Transfer" kích hoạt luồng mua.
- [ ] **Hyperledger Mock:** Backend Adapter lưu Ledger vào SQLite (chuẩn bị cho migration).
- [ ] **Usage Rights:** Hệ thống trừ Quota khi gọi API lấy dữ liệu.
- [ ] **Data Watermarking:** Nhúng ID người mua vào dữ liệu JSON trả về.

### 🎁 Phase 2 (Future):
- [ ] Tích hợp cổng thanh toán thật (VNPay/Stripe).
- [ ] Deploy Hyperledger Fabric Node thật (khi có hạ tầng Viettel).
- [ ] Media Watermarking (Steganography cho ảnh/video).

## 5. ƯỚC TÍNH SƠ BỘ
- **Độ phức tạp:** Trung bình (Logic phức tạp nhưng implementation dùng Mock nên nhanh).
- **Rủi ro:** Cần đảm bảo cấu trúc Mock Adapter giống thật để sau này dễ migrate.

## 7. BƯỚC TIẾP THEO
→ Thực thi theo Plan: `plans/260128-1515-enterprise-pivot/`
