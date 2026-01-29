# Phase 03: User Dashboard (Buyer/Seller)
Status: ⬜ Pending
Dependencies: Phase 02

## Objective
A dedicated area for users to manage their assets. It should look like a professional SaaS dashboard.

## Requirements
### Functional
- [ ] **Buyer Dashboard**:
    - List of Purchased Orders.
    - Quick "Download" button.
    - Status indicators (Locked, Released).
- [ ] **Seller Dashboard**:
    - "Create Asset" form with better validation.
    - List of uploaded assets with views/sales stats (Mock).

## Implementation Steps
1. [ ] **Layout**: Create `DashboardLayout.jsx` with Sidebar navigation.
2. [ ] **Access Portal**: Refactor `AccessPortal.jsx` into the Buyer Dashboard view.
3. [ ] **Seller Portal**: Polish `SellerDashboard.jsx` (Stats cards, Table view).

## Files to Create/Modify
- `frontend/src/layouts/DashboardLayout.jsx` - [NEW]
- `frontend/src/pages/BuyerDashboard.jsx` - [NEW]
- `frontend/src/pages/SellerDashboard.jsx` - [Polish]

## Test Criteria
- [ ] User can switch between Buyer/Seller tabs (or distinct routes).
- [ ] Data tables align correctly.
- [ ] Download button triggers the flow tested previously.

---
Next Phase: [Phase 04: Mock Data Realism](phase-04-mock-data.md)
