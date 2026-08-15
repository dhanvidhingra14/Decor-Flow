const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");

async function createClient() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected");

        const email = "client@decorflow.com";
        const password = "client123";

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            console.log("Client already exists");
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const client = await User.create({
            name: "DecorFlow Client",
            email: email,
            password: hashedPassword,
            role: "client"
        });

        console.log("================================");
        console.log("CLIENT CREATED SUCCESSFULLY");
        console.log("Name:", client.name);
        console.log("Email:", client.email);
        console.log("Password:", password);
        console.log("Role:", client.role);
        console.log("================================");

        process.exit(0);

    } catch (error) {
        console.error("CREATE CLIENT ERROR:", error);
        process.exit(1);
    }
}

createClient();