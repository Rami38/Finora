# Finora — frontend

React + Vite + Tailwind dashboard for the Finora personal finance app.

## Status
- [x] Sidebar navigation + routing
- [x] Login / register pages, wired to the backend
- [x] Overview page (summary cards + spending breakdown)
- [x] Transactions page (list, add, delete)
- [ ] Budget page
- [ ] Goals page
- [ ] Investment simulator
- [ ] Analytics page

## Setup

1. Make sure the backend is running on `http://localhost:8080` (see `finora-backend/README.md`).
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the dev server:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:5173`.

## Notes
- The API base URL is set in `src/api/client.js`. Change it there if your backend runs elsewhere.
- The JWT is stored in `localStorage` under `finora_token`, and attached automatically to every API request.
- Colors and design tokens live in `tailwind.config.js` under `theme.extend.colors`.
