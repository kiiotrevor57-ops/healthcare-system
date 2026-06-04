const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

dotenv.config();

const app = express();

// ---------------- SECURITY MIDDLEWARE ----------------
app.use(helmet());
app.use(express.json());
app.use(morgan("combined"));

app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
}));

// ---------------- STATIC FRONTEND ----------------
app.use(express.static(path.join(__dirname, "public")));

// ---------------- HEALTH CHECK ----------------
app.get("/health", (req, res) => {
    res.json({
        status: "OK",
        service: "County Health Inventory System",
        time: new Date()
    });
});

// ---------------- MOCK API (replace with DB later) ----------------
let inventory = [
    { id: 1, name: "Paracetamol", facility: "Nakuru Level 5", quantity: 10, reorder: 20, expiry: "2026-06-10" },
    { id: 2, name: "Amoxicillin", facility: "Molo Hospital", quantity: 5, reorder: 15, expiry: "2026-06-05" }
];

// GET INVENTORY
app.get("/api/inventory", (req, res) => {
    res.json(inventory);
});

// ADD MEDICINE
app.post("/api/inventory", (req, res) => {
    const item = {
        id: inventory.length + 1,
        ...req.body
    };

    inventory.push(item);

    res.json({
        message: "Item added successfully",
        item
    });
});

// ---------------- ROUTES ----------------
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});

app.get("/dashboard", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});

// ---------------- START SERVER ----------------
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});