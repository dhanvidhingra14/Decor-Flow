const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
    phone: { type: String, unique: true, sparse: true, trim: true },
    password: { type: String, required: function () { return this.role === "admin"; } },
    role: { type: String, enum: ["admin", "client"], default: "client" }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
