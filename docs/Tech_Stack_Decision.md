# Tech Stack Decision Document

**Project Name:** DecorFlow
**One-line description:** A management dashboard for interior/event decoration businesses to track bookings, clients, inventory materials, team assignments, and payments.
**Developed by:** Dhanvi Dhingra
**Built during internship at:** Talking Crooks IT Pvt. Ltd.

## Tech Stack Chosen

| Layer | Choice |
|---|---|
| Frontend | HTML + CSS + Vanilla JavaScript |
| Backend | Node.js (Express) |
| Database | SQLite (via better-sqlite3) |

**Why this combination:** DecorFlow is fundamentally an admin/management panel — tables, forms, and stat cards — not a highly interactive single-page app, so a full frontend framework like React isn't necessary. Express gives a simple, well-documented REST API layer, and SQLite needs no separate server install (it's a single file, `decorflow.db`), which makes the project trivial to run locally and demo on any machine. This is the same "Full Web (Classic)" combination the task brief recommends for "admin panels, management tools."

## Core Features Built in This Task

- **Dashboard** — live stats (active bookings, setups today, pending payments, material clashes), today's setups list, project phase progress bars
- **Bookings List** — all bookings in a filterable table with client, date, status, balance due, assigned team member; total receivables summary
- **New Booking Form** — create a booking: client info, event logistics, theme/design notes, materials required (checked against inventory for clashes), quote/advance financials
- **Database-backed CRUD** — bookings, clients, inventory items, and team members are all persisted in SQLite and connected end-to-end (form submit → API → DB → list view reflects new data)

## Out of Scope (For Later)

- Authentication/login and multi-user roles
- Payment gateway integration (WhatsApp payment reminders, online payment collection)
- Full "Inventory," "Schedule," and "Clients" pages (sidebar links present but only Dashboard, Bookings List, and New Booking are built out this phase)
- Revenue forecasting / AI insights panel
- File/image uploads for inspiration gallery
