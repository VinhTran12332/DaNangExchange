# Phase 02: Product Detail & Checkout Flow
Status: ⬜ Pending
Dependencies: Phase 01

## Objective
Make the "Shopping Experience" convincing. The Product Detail page must look information-rich, and the Checkout process (even if mock) must feel secure and smooth.

## Requirements
### Functional
- [ ] **Product Detail**:
    - Rich Metadata (Tags, Format, Size, Version).
    - Preview Section (Mock Table or Chart preview).
    - "Buy Now" Sticky Bar on mobile.
- [ ] **Checkout/Payment**:
    - Modal or Step-by-step checkout page.
    - Payment Method Selection (Mock QR Code).
    - Success/Loading States animations.

## Implementation Steps
1. [ ] **Product Detail**: Enhance `ProductDetail.jsx` with tabs (Description, Preview, License).
2. [ ] **Checkout Logic**: integrated or separate `Checkout.jsx` page.
3. [ ] **Payment Simulation**: Visual polish for `DevPayment.jsx` (rename to `PaymentGateway.jsx` for pro feel).

## Files to Create/Modify
- `frontend/src/pages/ProductDetail.jsx`
- `frontend/src/components/checkout/PaymentModal.jsx` - [NEW]
- `frontend/src/pages/PaymentSuccess.jsx` - [NEW]

## Test Criteria
- [ ] Clicking "Buy" opens Checkout.
- [ ] Payment flow transitions smoothly (Loading -> Success).
- [ ] Order ID is clearly displayed after purchase.

---
Next Phase: [Phase 03: User Dashboard](phase-03-user-dashboard.md)
