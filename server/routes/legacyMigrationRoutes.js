const express = require("express");
const jwt = require("jsonwebtoken");
const Customer = require("../models/Customer");
const Employee = require("../models/Employee");
const Booking = require("../models/Booking");

const router = express.Router();

const statusForLegacyBooking = (status) => {
    if (status === "completed") return "Completed";
    if (["ready", "in_progress"].includes(status)) return "Confirmed";
    return "Pending";
};

const paymentStatusFor = (budget, paidAmount) => {
    if (paidAmount >= budget && budget > 0) return "Paid";
    if (paidAmount > 0) return "Partially Paid";
    return "Unpaid";
};

const requireAdmin = (req, res, next) => {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) return res.status(503).json({ message: "Migration is disabled until JWT_SECRET is configured." });

    try {
        const token = String(req.headers.authorization || "").replace("Bearer ", "");
        const payload = jwt.verify(token, jwtSecret);
        if (payload.role !== "admin") return res.status(403).json({ message: "Admin access is required." });
        req.user = payload;
        next();
    } catch (_error) {
        return res.status(401).json({ message: "A valid admin session is required." });
    }
};

router.post("/legacy-sqlite", requireAdmin, async (req, res) => {
    const customers = Array.isArray(req.body.customers) ? req.body.customers : [];
    const employees = Array.isArray(req.body.employees) ? req.body.employees : [];
    const bookings = Array.isArray(req.body.bookings) ? req.body.bookings : [];

    if (!customers.length && !employees.length && !bookings.length) {
        return res.status(400).json({ message: "No legacy records were supplied." });
    }

    try {
        const customerIds = new Map();
        const employeeIds = new Map();
        let importedCustomers = 0;
        let importedEmployees = 0;
        let importedBookings = 0;

        for (const legacyCustomer of customers) {
            if (!legacyCustomer.id || !legacyCustomer.name || !legacyCustomer.phone) continue;
            let customer = await Customer.findOne({ phone: legacyCustomer.phone });
            if (!customer) {
                customer = await Customer.create({ name: legacyCustomer.name, phone: legacyCustomer.phone });
                importedCustomers += 1;
            }
            customerIds.set(String(legacyCustomer.id), customer._id);
        }

        for (const legacyEmployee of employees) {
            if (!legacyEmployee.id || !legacyEmployee.name) continue;
            let employee = await Employee.findOne({ name: legacyEmployee.name, role: legacyEmployee.role || "Team member" });
            if (!employee) {
                employee = await Employee.create({ name: legacyEmployee.name, role: legacyEmployee.role || "Team member" });
                importedEmployees += 1;
            }
            employeeIds.set(String(legacyEmployee.id), employee._id);
        }

        for (const legacyBooking of bookings) {
            const customer = customerIds.get(String(legacyBooking.customerId));
            if (!legacyBooking.id || !customer || !legacyBooking.eventType || !legacyBooking.eventDate || !legacyBooking.venue) continue;

            const marker = `[legacy-sqlite-booking:${legacyBooking.id}]`;
            const alreadyImported = await Booking.exists({ notes: { $regex: marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") } });
            if (alreadyImported) continue;

            const budget = Number(legacyBooking.budget || 0);
            const paidAmount = Number(legacyBooking.paidAmount || 0);
            const assignedEmployee = employeeIds.get(String(legacyBooking.assignedEmployeeId));

            await Booking.create({
                customer,
                eventType: legacyBooking.eventType,
                eventDate: legacyBooking.eventDate,
                venue: legacyBooking.venue,
                packageName: "Legacy booking",
                budget,
                paidAmount,
                paymentStatus: paymentStatusFor(budget, paidAmount),
                status: statusForLegacyBooking(legacyBooking.status),
                assignedEmployees: assignedEmployee ? [assignedEmployee] : [],
                notes: `${legacyBooking.notes || ""}\n${marker}`.trim()
            });
            importedBookings += 1;
        }

        return res.status(201).json({
            message: "Legacy data imported successfully.",
            imported: { customers: importedCustomers, employees: importedEmployees, bookings: importedBookings }
        });
    } catch (error) {
        console.error("LEGACY DATA MIGRATION ERROR:", error);
        return res.status(500).json({ message: "Legacy data migration failed." });
    }
});

module.exports = router;
