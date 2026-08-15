// Seeds the database with demo data so the app isn't empty on first run.
const db = require('./db');

const clientCount = db.prepare('SELECT COUNT(*) AS c FROM clients').get().c;
if (clientCount > 0) {
  console.log('Database already has data — skipping seed. Delete decorflow.db to reseed.');
  process.exit(0);
}

const insertClient = db.prepare('INSERT INTO clients (name, phone) VALUES (?, ?)');
const insertTeam = db.prepare('INSERT INTO team_members (name, role, initials) VALUES (?, ?, ?)');
const insertItem = db.prepare('INSERT INTO inventory_items (name, category, quantity, status) VALUES (?, ?, ?, ?)');
const insertBooking = db.prepare(`INSERT INTO bookings
  (client_id, event_name, event_type, event_date, venue, theme_notes, status, quote_amount, advance_received, assigned_team_id)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
const insertMaterial = db.prepare('INSERT INTO booking_materials (booking_id, item_id, clash) VALUES (?, ?, ?)');

const clients = [
  ['Anita & Vikram', '+91 98200 11223'],
  ['Corporate Annual Gala - ITC', '+91 98200 44556'],
  ['Roy Residence', '+91 98200 77889'],
  ['Sharma Wedding', '+91 98200 12121'],
  ['Mehta Family', '+91 98200 34343'],
  ['HDFC Bank Events', '+91 98200 56565'],
  ['Kapoor Family', '+91 98200 78787'],
  ['Iyer Family', '+91 98200 90909'],
];
const clientIds = clients.map(c => insertClient.run(c[0], c[1]).lastInsertRowid);

const team = [
  ['Rohan Verma', 'Setup Lead', 'RV'],
  ['Suman Kaur', 'Designer', 'SK'],
  ['Priya Nair', 'Coordinator', 'PN'],
  ['Rajesh Gupta', 'Procurement', 'RG'],
];
const teamIds = team.map(t => insertTeam.run(t[0], t[1], t[2]).lastInsertRowid);

const items = [
  ['Fairy Lights', 'Lighting', 40, 'available'],
  ['Teal Drapes', 'Fabric', 20, 'available'],
  ['Floral Arch', 'Structure', 2, 'booked'],
  ['Gold Vases', 'Decor', 30, 'available'],
  ['Silver Drapery', 'Fabric', 0, 'low_stock'],
  ['Stage Backdrop', 'Structure', 3, 'available'],
];
const itemIds = items.map(i => insertItem.run(i[0], i[1], i[2], i[3]).lastInsertRowid);

const bookings = [
  [clientIds[0], 'Anita & Vikram Wedding', 'Wedding', '2026-08-24', 'Grand Palace', 'Luxury traditional decor, gold and red palette.', 'ready', 250000, 130000, teamIds[0]],
  [clientIds[1], 'Corporate Annual Gala', 'Corporate', '2026-08-14', 'ITC Grand', 'Minimalist stage and lounge, corporate teal branding.', 'in_progress', 320000, 234000, teamIds[1]],
  [clientIds[2], 'Festive Home Decor - Roy Residence', 'Housewarming', '2026-08-12', 'Malabar Hill', 'Warm festive lights, floral centerpieces.', 'ready', 85000, 85000, teamIds[2]],
  [clientIds[3], 'Sharma Wedding', 'Wedding', '2026-10-24', 'Grand Palace', 'Luxury Traditional Decor', 'upcoming', 250000, 130000, teamIds[0]],
  [clientIds[4], 'Mehta 50th Birthday', 'Birthday', '2026-10-28', 'Sea Lounge', 'Evening Gala Theme', 'ready', 90000, 45000, teamIds[1]],
  [clientIds[5], 'HDFC Corporate Meet', 'Corporate', '2026-11-02', 'HDFC Convention Center', 'Minimalist Stage & Lounge', 'in_progress', 150000, 150000, teamIds[2]],
  [clientIds[6], 'Kapoor Diwali Decor', 'Festival', '2026-11-10', 'Kapoor Residence', 'Floral & Light Installations', 'upcoming', 60000, 35000, teamIds[3]],
  [clientIds[7], 'Iyer Housewarming', 'Housewarming', '2026-10-22', 'Iyer Residence', 'Sustainable Contemporary', 'ready', 70000, 70000, teamIds[0]],
];
const bookingIds = bookings.map(b => insertBooking.run(...b).lastInsertRowid);

// Materials for booking 0 (Anita & Vikram Wedding) - matches wireframe: Fairy Lights, Teal Drapes, Floral Arch (clash), Gold Vases
insertMaterial.run(bookingIds[0], itemIds[0], 0);
insertMaterial.run(bookingIds[0], itemIds[1], 0);
insertMaterial.run(bookingIds[0], itemIds[2], 1); // Floral Arch - already booked clash
insertMaterial.run(bookingIds[0], itemIds[3], 0);

console.log(`Seeded ${clientIds.length} clients, ${teamIds.length} team members, ${itemIds.length} inventory items, ${bookingIds.length} bookings.`);
