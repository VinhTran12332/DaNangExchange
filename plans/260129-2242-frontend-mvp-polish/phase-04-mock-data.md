# Phase 04: Mock Data Realism
Status: ⬜ Pending
Dependencies: Phase 01, 02, 03

## Objective
Replace "Test Product 1" with meaningful, impressive-sounding data products to attract investors.

## Requirements
- [ ] **Seed Data**: Create ~10 diverse high-quality assets.
    - "Hanoi Real Estate Transaction 2024"
    - "Vietnam E-commerce Behavior Dataset"
    - "Crypto Market Sentiment Analysis (Daily)"
- [ ] **Images**: Use placeholder images (e.g., Unsplash/abstract charts) for thumbnails.

## Implementation Steps
1. [ ] **DB Seeding**: Create a `seed_demo_data.js` script to populate the SQLite DB with these assets.
2. [ ] **Source URLs**: Link them to valid public Google Sheets (or use the one we tested) so downloads work.

## Files to Create/Modify
- `seed_demo_data.js` - [NEW]
- `assets/images/` - [Add sample thumbnails]

## Test Criteria
- [ ] Home page grid shows diverse, real-looking data products.
- [ ] Search filters work with these new categories.

---
Next Phase: [Phase 05: Deployment](phase-05-deployment.md)
