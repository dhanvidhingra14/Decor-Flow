const express = require("express");
const Employee = require("../models/Employee");
const router = express.Router();
router.get("/", async (req, res) => { try { res.json(await Employee.find().sort({ createdAt: -1 })); } catch (error) { res.status(500).json({ message: "Failed to fetch employees" }); } });
router.post("/", async (req, res) => { try { const { name, phone, role } = req.body; if (!name || !role) return res.status(400).json({ message: "Name and role are required" }); res.status(201).json(await Employee.create({ name, phone, role })); } catch (error) { res.status(500).json({ message: "Failed to add employee" }); } });
router.delete("/:id", async (req, res) => { try { const employee = await Employee.findByIdAndDelete(req.params.id); if (!employee) return res.status(404).json({ message: "Employee not found" }); res.json({ message: "Employee removed" }); } catch (error) { res.status(500).json({ message: "Failed to remove employee" }); } });
module.exports = router;
