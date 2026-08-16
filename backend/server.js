const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// ---------- Helpers ----------
function balanceDue(row) {
  return Number(row.quote_amount || 0) - Number(row.advance_received || 0);
}

// ---------- Dashboard ----------
app.get('/api/dashboard/stats', (req, res) => {
  const activeBookings = db.prepare(
    "SELECT COUNT(*) AS c FROM bookings WHERE status != 'completed'"
  ).get().c;

  const today = new Date().toISOString().slice(0, 10);
  const setupsToday = db.prepare(
    'SELECT COUNT(*) AS c FROM bookings WHERE event_date = ?'
  ).get(today).c;

  const bookings = db.prepare('SELECT quote_amount, advance_received FROM bookings').all();
  const pendingPayments = bookings.reduce((sum, b) => sum + Math.max(balanceDue(b), 0), 0);

  const materialClashes = db.prepare(
    'SELECT COUNT(*) AS c FROM booking_materials WHERE clash = 1'
  ).get().c;

  res.json({ activeBookings, setupsToday, pendingPayments, materialClashes });
});

app.get('/api/dashboard/todays-setups', (req, res) => {
  const rows = db.prepare(`
    SELECT b.booking_id, b.event_name, b.venue, b.status, t.name AS team_name
    FROM bookings b
    LEFT JOIN team_members t ON b.assigned_team_id = t.team_id
    ORDER BY b.event_date ASC
    LIMIT 5
  `).all();
  res.json(rows);
});

// ---------- Clients ----------
app.get('/api/clients', (req, res) => {
  res.json(db.prepare('SELECT * FROM clients ORDER BY name').all());
});

// ---------- Team ----------
app.get('/api/team', (req, res) => {
  res.json(db.prepare('SELECT * FROM team_members ORDER BY name').all());
});

// ---------- Inventory ----------
app.get('/api/inventory', (req, res) => {
  res.json(db.prepare('SELECT * FROM inventory_items ORDER BY name').all());
});

// ---------- Bookings ----------
app.get('/api/bookings', (req, res) => {
  const rows = db.prepare(`
    SELECT b.*, c.name AS client_name, t.name AS team_name
    FROM bookings b
    JOIN clients c ON b.client_id = c.client_id
    LEFT JOIN team_members t ON b.assigned_team_id = t.team_id
    ORDER BY b.event_date ASC
  `).all();

  const withBalance = rows.map(r => ({ ...r, balance_due: balanceDue(r) }));
  const totalReceivables = withBalance.reduce((s, r) => s + Math.max(r.balance_due, 0), 0);

  res.json({ bookings: withBalance, totalReceivables, count: withBalance.length });
});

app.get('/api/bookings/:id', (req, res) => {
  const booking = db.prepare(`
    SELECT b.*, c.name AS client_name, c.phone AS client_phone, t.name AS team_name
    FROM bookings b
    JOIN clients c ON b.client_id = c.client_id
    LEFT JOIN team_members t ON b.assigned_team_id = t.team_id
    WHERE b.booking_id = ?
  `).get(req.params.id);

  if (!booking) return res.status(404).json({ error: 'Booking not found' });

  const materials = db.prepare(`
    SELECT bm.*, i.name AS item_name, i.status AS item_status
    FROM booking_materials bm
    JOIN inventory_items i ON bm.item_id = i.item_id
    WHERE bm.booking_id = ?
  `).all(req.params.id);

  res.json({ ...booking, balance_due: balanceDue(booking), materials });
});

// Create a new booking (creates client if new, links materials, checks clashes)
app.post('/api/bookings', (req, res) => {
  const {
    client_name, client_phone, event_name, event_type, event_date,
    venue, theme_notes, quote_amount, advance_received, material_ids
  } = req.body;

  if (!client_name || !event_name || !event_date) {
    return res.status(400).json({ error: 'client_name, event_name, and event_date are required' });
  }

  const tx = db.transaction(() => {
    // find or create client
    let client = db.prepare('SELECT * FROM clients WHERE name = ?').get(client_name);
    let clientId;
    if (client) {
      clientId = client.client_id;
    } else {
      clientId = db.prepare('INSERT INTO clients (name, phone) VALUES (?, ?)')
        .run(client_name, client_phone || null).lastInsertRowid;
    }

    const bookingId = db.prepare(`
      INSERT INTO bookings (client_id, event_name, event_type, event_date, venue, theme_notes, status, quote_amount, advance_received)
      VALUES (?, ?, ?, ?, ?, ?, 'upcoming', ?, ?)
    `).run(clientId, event_name, event_type || null, event_date, venue || null, theme_notes || null,
           quote_amount || 0, advance_received || 0).lastInsertRowid;

    if (Array.isArray(material_ids)) {
      const insertMat = db.prepare('INSERT INTO booking_materials (booking_id, item_id, clash) VALUES (?, ?, ?)');
      for (const itemId of material_ids) {
        const item = db.prepare('SELECT status FROM inventory_items WHERE item_id = ?').get(itemId);
        const clash = item && item.status === 'booked' ? 1 : 0;
        insertMat.run(bookingId, itemId, clash);
      }
    }

    return bookingId;
  });

  const bookingId = tx();
  res.status(201).json({ booking_id: bookingId, message: 'Booking created' });
});
// Health check for Render
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`DecorFlow server running on port ${PORT}`);
});
app.listen(PORT, () => {
  console.log(`DecorFlow server running at http://localhost:${PORT}`);
});
