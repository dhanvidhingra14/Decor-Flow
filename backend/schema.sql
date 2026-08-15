-- ============================================================
-- DecorFlow Database Schema
-- Developed by Dhanvi Dhingra | Talking Crooks IT Pvt. Ltd. Internship
-- ============================================================

-- Clients: people/companies who book decor projects
CREATE TABLE IF NOT EXISTS clients (
    client_id     INTEGER PRIMARY KEY AUTOINCREMENT,
    name          VARCHAR(120) NOT NULL,
    phone         VARCHAR(30),
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Team members: staff who get assigned to bookings
CREATE TABLE IF NOT EXISTS team_members (
    team_id       INTEGER PRIMARY KEY AUTOINCREMENT,
    name          VARCHAR(120) NOT NULL,
    role          VARCHAR(60),
    initials      VARCHAR(4),
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Inventory items: materials/props available for events
CREATE TABLE IF NOT EXISTS inventory_items (
    item_id       INTEGER PRIMARY KEY AUTOINCREMENT,
    name          VARCHAR(120) NOT NULL,
    category      VARCHAR(60),
    quantity      INTEGER DEFAULT 0,
    status        VARCHAR(20) DEFAULT 'available', -- available | booked | low_stock
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Bookings: the central entity - one event/project for one client
CREATE TABLE IF NOT EXISTS bookings (
    booking_id       INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id        INTEGER NOT NULL,
    event_name       VARCHAR(150) NOT NULL,
    event_type       VARCHAR(60),               -- Wedding, Corporate, Birthday, Housewarming...
    event_date       DATE NOT NULL,
    venue            VARCHAR(200),
    theme_notes      TEXT,
    status            VARCHAR(20) DEFAULT 'upcoming', -- upcoming | ready | in_progress | completed
    quote_amount      DECIMAL(10,2) DEFAULT 0,
    advance_received  DECIMAL(10,2) DEFAULT 0,
    assigned_team_id  INTEGER,
    created_at        DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(client_id),
    FOREIGN KEY (assigned_team_id) REFERENCES team_members(team_id)
);

-- Booking <-> Inventory junction table: materials required per booking
CREATE TABLE IF NOT EXISTS booking_materials (
    booking_material_id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_id           INTEGER NOT NULL,
    item_id               INTEGER NOT NULL,
    clash                 BOOLEAN DEFAULT 0, -- 1 if item already booked elsewhere for same date
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES inventory_items(item_id)
);

-- Payments: records against a booking (advance, partial, final)
CREATE TABLE IF NOT EXISTS payments (
    payment_id     INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_id     INTEGER NOT NULL,
    amount         DECIMAL(10,2) NOT NULL,
    payment_date   DATE DEFAULT CURRENT_DATE,
    method         VARCHAR(40),
    reference      VARCHAR(80),
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE
);

-- ============================================================
-- Relationships
-- clients        1 : N   bookings
-- team_members   1 : N   bookings   (assigned_team_id)
-- bookings       1 : N   booking_materials
-- inventory_items 1 : N  booking_materials
-- bookings       1 : N   payments
-- ============================================================
