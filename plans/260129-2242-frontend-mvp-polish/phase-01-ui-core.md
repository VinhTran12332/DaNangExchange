# Phase 01: UI Core & Home Page
Status: ⬜ Pending
Dependencies: None

## Objective
Establish a premium, trustworthy visual identity and meaningful navigation. Provide immediate access to key functions (Dashboards, Data Access) directly from the landing page.

## Requirements
### Functional
- [ ] **Global Navigation (Header)**:
    - [ ] **Dashboard Links**: Add direct access to External Dashboards (Lovable.app) for demo.
        - Seller: `https://startup2026v1.lovable.app/seller`
        - Buyer: `https://startup2026v1.lovable.app/buyer`
        - *Note: Open in new tab or use specialized "Portal" view.*
    - [ ] **Sticky State**: Changes appearance when scrolling (Glassmorphism).
- [ ] **Home Page Interactivity**:
    - [ ] **Hero Section**:
        - CTA "Explore Data" -> Scroll to Data Grid.
        - Secondary CTA "Unlock Data" -> Navigate to `/access` (The Watermark Flow).
    - [ ] **Featured Grid**: Clicking an asset -> Navigate to Detail Page (Phase 2) or Quick Buy toggle.
    - [ ] **Interactive Elements**: All buttons must have hover states and active links.

### Non-Functional
- [ ] **Visual Polish**: Professional "Fintech" color palette (Deep Navy/Emerald).
- [ ] **Responsiveness**: Mobile-friendly Menu for dashboard links.

## Implementation Steps
1. [ ] **Global Styles**: Define color variables and typography in `index.css`.
2. [ ] **Refactor Header**: Implement `Link` to internal routes and `a href` for Lovable dashboards. Add "Log In" dropdown or separate Buyer/Seller buttons.
3. [ ] **Refactor Home**:
    - Build Hero with explicit navigation buttons.
    - Ensure "Featured Data" grid renders dummy data if DB is empty, or fetches real assets.
    - Add "Quick Access" section linking to `/access`.

## Files to Create/Modify
- `frontend/src/index.css` - [Theme setup]
- `frontend/src/components/layout/Header.jsx` - [Add Lovable Links & Sticky logic]
- `frontend/src/components/layout/Footer.jsx` - [Update Links]
- `frontend/src/pages/Home.jsx` - [Hero CTAs & Navigation]

## Test Criteria
- [ ] Header links to Lovable.app open correctly.
- [ ] Hero "Unlock Data" button navigates to `/access`.
- [ ] Home page elements are clickable and give visual feedback (Hover).

---
Next Phase: [Phase 02: Product Detail & Checkout](phase-02-checkout.md)
