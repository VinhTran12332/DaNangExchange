# Phase 05: Deployment (Github + Vercel)
Status: ⬜ Pending
Dependencies: Phase 04

## Objective
Make the project accessible via a public URL for the investor pitch.

## Requirements
- [ ] **Github**: Push latest code to a standardized repository.
- [ ] **Frontend**: Deploy to Vercel.
- [ ] **Backend (Optional for UI Demo)**:
    - If needed: Deploy to Render/Railway/Fly.io.
    - OR: Mock API calls in Frontend (if backend deployment is too complex for now).
    - *Decision*: We will aim to keep the Backend running (locally via Tunnel) OR deploy it. Given the "Tunnel" issues earlier, a proper Cloud Deployment is safer.

## Implementation Steps
1. [ ] **Cleanup**: Remove hardcoded `localhost:3000` from frontend code; use `VITE_API_URL` env var.
2. [ ] **Config**: Create `vercel.json` (if needed for rewrites).
3. [ ] **Push**: Git init, commit, push.
4. [ ] **Deploy**: Link Vercel to Github.

## Files to Create/Modify
- `.env.production` - [Frontend Env]
- `vercel.json` - [Frontend Config]

## Test Criteria
- [ ] Public URL loads title.
- [ ] API calls connect (or fail gracefully).

---
**End of Plan**
