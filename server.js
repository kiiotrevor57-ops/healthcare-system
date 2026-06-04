const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const path = require("path");
app.use(express.static("public"));
const app = express();


app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

const pool = new Pool({
    user: "lyveenkiio",
    host: "localhost",
    database: "healthcare",
    password: "",
    port: 5432
});
// =========================
// HEALTH CHECK
// =========================
const path = require("path");

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});

// =========================
// ADD MEDICINE
// =========================
app.post("/add-medicine", async (req, res) => {
    try {
        const { qr_id, name, batch_number, expiry_date, quantity, reorder_level } = req.body;

        if (!qr_id || !name) {
            return res.status(400).json({ message: "QR ID and name are required" });
        }

        await pool.query(
            `INSERT INTO medicines 
            (qr_id, name, batch_number, expiry_date, quantity, reorder_level)
            VALUES ($1,$2,$3,$4,$5,$6)`,
            [qr_id, name, batch_number, expiry_date, quantity, reorder_level]
        );

        await pool.query(
            "INSERT INTO logs (action) VALUES ($1)",
            [`Added medicine: ${name}`]
        );

        res.status(201).json({ message: "Medicine added successfully" });

    } catch (err) {
        console.error(err);

        if (err.code === "23505") {
            return res.status(409).json({ message: "Medicine already exists (duplicate QR ID)" });
        }

        res.status(500).json({ message: "Server error" });
    }
});

// =========================
// VIEW INVENTORY
// =========================
app.get("/inventory", async (req, res) => {
    const result = await pool.query("SELECT * FROM medicines");
    res.json(result.rows);
});


// =========================
// ISSUE MEDICINE
// =========================
app.post("/issue", async (req, res) => {
    try {
        const { qr_id, quantity } = req.body;

        if (!qr_id || !quantity) {
            return res.status(400).json({ message: "QR ID and quantity required" });
        }

        const result = await pool.query(
            "SELECT * FROM medicines WHERE qr_id=$1",
            [qr_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Medicine not found" });
        }

        const med = result.rows[0];

        if (quantity > med.quantity) {
            return res.status(400).json({ message: "Not enough stock" });
        }

        await pool.query(
            "UPDATE medicines SET quantity = quantity - $1 WHERE qr_id=$2",
            [quantity, qr_id]
        );

        await pool.query(
            "INSERT INTO logs (action) VALUES ($1)",
            [`Issued ${quantity} of ${med.name}`]
        );

        res.json({ message: "Medicine issued successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// =========================
// RECEIVE STOCK
// =========================
app.post("/receive", async (req, res) => {
    try {
        const { qr_id, quantity } = req.body;

        if (!qr_id || !quantity) {
            return res.status(400).json({ message: "QR ID and quantity required" });
        }

        const result = await pool.query(
            "UPDATE medicines SET quantity = quantity + $1 WHERE qr_id=$2 RETURNING *",
            [quantity, qr_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Medicine not found" });
        }

        await pool.query(
            "INSERT INTO logs (action) VALUES ($1)",
            [`Received ${quantity} units of ${result.rows[0].name}`]
        );

        res.json({ message: "Stock updated successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// =========================
// START SERVER
// =========================
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

