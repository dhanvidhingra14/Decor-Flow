const mongoose = require("mongoose");
const employeeSchema = new mongoose.Schema({ name: { type: String, required: true, trim: true }, phone: { type: String, default: "", trim: true }, role: { type: String, required: true, trim: true }, status: { type: String, enum: ["Active", "Inactive"], default: "Active" } }, { timestamps: true });
module.exports = mongoose.model("Employee", employeeSchema);
