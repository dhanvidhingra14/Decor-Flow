const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Used by Render to verify that the service is running after deployment.
app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
});

// ROUTES

const customerRoutes = require("./routes/customerRoutes");
const packageRoutes = require("./routes/packageRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const authRoutes = require("./routes/authRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const legacyMigrationRoutes = require("./routes/legacyMigrationRoutes");

// ROUTES
app.use("/api/customers", customerRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/migration", legacyMigrationRoutes);

async function ensureAdminUser() {
    const email = process.env.ADMIN_EMAIL?.toLowerCase().trim();
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
        console.warn("Demo admin was not created: set ADMIN_EMAIL and ADMIN_PASSWORD in the environment.");
        return;
    }

    try {
        const existingAdmin = await User.findOne({ email });
        if (existingAdmin) return;

        await User.create({
            name: "DecorFlow Admin",
            email,
            password: await bcrypt.hash(password, 10),
            role: "admin"
        });
        console.log(`Demo admin created for ${email}`);
    } catch (error) {
        console.error("DEMO ADMIN SETUP ERROR:", error);
    }
}

// DATABASE
mongoose
    .connect(process.env.MONGO_URI)
    .then(async () => {

        console.log("MongoDB connected");
        await ensureAdminUser();

        const PORT =
            process.env.PORT || 5000;

        app.listen(PORT, () => {

            console.log(
                `Server running on http://localhost:${PORT}`
            );

        });

    })
    .catch((error) => {

        console.error(
            "MongoDB connection error:",
            error
        );

    });

