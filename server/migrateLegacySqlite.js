const Database = require("../backend/node_modules/better-sqlite3");

const apiUrl = process.env.MIGRATION_API_URL || "https://decor-flow-backend.onrender.com/api";
const email = process.env.MIGRATION_ADMIN_EMAIL;
const password = process.env.MIGRATION_ADMIN_PASSWORD;

if (!email || !password) {
    console.error("Set MIGRATION_ADMIN_EMAIL and MIGRATION_ADMIN_PASSWORD before running this script.");
    process.exit(1);
}

const normalizePhone = (phone) => String(phone || "").replace(/\D/g, "").replace(/^91(?=\d{10}$)/, "");
const db = new Database("../backend/decorflow.db", { readonly: true });

const payload = {
    customers: db.prepare("SELECT client_id AS id, name, phone FROM clients").all().map((customer) => ({ ...customer, phone: normalizePhone(customer.phone) })),
    employees: db.prepare("SELECT team_id AS id, name, role FROM team_members").all(),
    bookings: db.prepare(`SELECT booking_id AS id, client_id AS customerId, event_type AS eventType, event_date AS eventDate, venue, theme_notes AS notes, status, quote_amount AS budget, advance_received AS paidAmount, assigned_team_id AS assignedEmployeeId FROM bookings`).all()
};

db.close();

(async () => {
    const login = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role: "admin" })
    });
    const loginData = await login.json();
    if (!login.ok) throw new Error(loginData.message || "Admin login failed.");

    const migration = await fetch(`${apiUrl}/migration/legacy-sqlite`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${loginData.token}` },
        body: JSON.stringify(payload)
    });
    const migrationData = await migration.json();
    if (!migration.ok) throw new Error(migrationData.message || "Migration failed.");
    console.log(JSON.stringify(migrationData));
})().catch((error) => {
    console.error(error.message);
    process.exit(1);
});
