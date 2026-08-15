const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const MONGO_URI =
    process.env.MONGO_URI ||
    "mongodb://127.0.0.1:27017/decorflow";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true
        },

        role: {
            type: String,
            enum: ["admin", "client"],
            required: true
        }
    },
    {
        timestamps: true
    }
);

const User = mongoose.model("User", userSchema);

async function createUsers() {

    try {

        await mongoose.connect(MONGO_URI);

        console.log("MongoDB connected");

        const adminPassword =
            await bcrypt.hash("admin123", 10);

        await User.findOneAndUpdate(
            {
                email: "admin@decorflow.com"
            },
            {
                name: "DecorFlow Admin",
                email: "admin@decorflow.com",
                password: adminPassword,
                role: "admin"
            },
            {
                upsert: true,
                new: true
            }
        );

        console.log("Admin created/updated");


        const clientPassword =
            await bcrypt.hash("client123", 10);

        await User.findOneAndUpdate(
            {
                email: "client@decorflow.com"
            },
            {
                name: "DecorFlow Client",
                email: "client@decorflow.com",
                password: clientPassword,
                role: "client"
            },
            {
                upsert: true,
                new: true
            }
        );

        console.log("Client created/updated");

        console.log("");
        console.log("==============================");
        console.log("LOGIN ACCOUNTS");
        console.log("==============================");
        console.log("");
        console.log("ADMIN");
        console.log("Email: admin@decorflow.com");
        console.log("Password: admin123");
        console.log("");
        console.log("CLIENT");
        console.log("Email: client@decorflow.com");
        console.log("Password: client123");
        console.log("");
        console.log("==============================");

    }
    catch (error) {

        console.error("CREATE USERS ERROR:", error);

    }
    finally {

        await mongoose.connection.close();

        console.log("MongoDB connection closed");

    }
}

createUsers();
