# DecorFlow

**Interior & Event Decoration Management Dashboard**

Developed by **Dhanvi Dhingra**
Built during internship at **Talking Crooks IT Pvt. Ltd.**

## What This Project Does

DecorFlow helps a decor/event management business track bookings end-to-end:

- **Dashboard** — live stats (active bookings, today's setups, pending payments, material clashes) and today's setup list, pulled straight from the database.
- **Bookings List** — every booking with client, event date, status, balance due, and assigned team member, plus total receivables.
- **New Booking Form** — create a booking: client details, event logistics, theme notes, materials required (with automatic clash detection against inventory), and quote/advance financials.

All three screens are fully connected: submitting the New Booking form writes to the SQLite database, and the Bookings List / Dashboard immediately reflect the new data.

## Tech Stack

- **Frontend:** HTML, CSS, vanilla JavaScript (no framework/build step)
- **Backend:** Node.js + Express (REST API)
- **Database:** SQLite (via `better-sqlite3`)

## Project Structure

```
decorflow/
├── backend/
│   ├── server.js       # Express app + all API routes
│   ├── db.js            # SQLite connection, runs schema.sql on boot
│   ├── schema.sql        # Full database schema (tables, FKs, relationships)
│   ├── seed.js           # Populates demo data (clients, bookings, inventory, team)
│   └── package.json
├── frontend/
│   ├── index.html         # Dashboard
│   ├── bookings.html      # Bookings List
│   ├── new-booking.html    # New Booking form
│   ├── css/style.css
│   └── js/app.js
└── docs/
    └── Tech_Stack_Decision.md
```

## How to Run It Locally

1. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Seed the database** (creates `decorflow.db` with demo clients, bookings, inventory, and team members)
   ```bash
   npm run seed
   ```

3. **Start the server**
   ```bash
   npm start
   ```

4. **Open the app** — go to [http://localhost:3000](http://localhost:3000) in your browser. The Express server serves both the API and the static frontend, so nothing else needs to run.

5. To reset the data, stop the server, delete `backend/decorflow.db` (and the `-wal`/`-shm` files if present), and re-run `npm run seed`.

## API Routes

| Method | Route | Purpose |
|---|---|---|
| GET | `/api/dashboard/stats` | Active bookings, setups today, pending payments, material clashes |
| GET | `/api/dashboard/todays-setups` | Next 5 upcoming setups |
| GET | `/api/bookings` | All bookings with client & team joined, plus total receivables |
| GET | `/api/bookings/:id` | Single booking with its materials |
| POST | `/api/bookings` | Create a booking (auto-creates client if new, links materials, flags clashes) |
| GET | `/api/clients` | All clients |
| GET | `/api/team` | All team members |
| GET | `/api/inventory` | All inventory items with availability status |

## Database Schema

See `backend/schema.sql` for the full schema. Summary of relationships:

- `clients` 1:N `bookings`
- `team_members` 1:N `bookings` (assigned staff)
- `bookings` 1:N `booking_materials` N:1 `inventory_items` (many-to-many materials-per-booking)
- `bookings` 1:N `payments`

## Notes / Scope

This build covers Dashboard, Bookings List, and New Booking — the core must-have screens from the wireframe. Inventory, Schedule, and Clients pages are in the sidebar but not yet built out (marked out-of-scope in the tech stack decision doc). Login/auth and payment gateway integration are also out of scope for this phase.
