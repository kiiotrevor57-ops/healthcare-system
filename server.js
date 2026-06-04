const express = require("express");
const app = express();
const path = require("path");

app.use(express.json());
app.use(express.static("public"));

/* ---------------- ROUTES ---------------- */

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});

app.get("/dashboard", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});

app.get("/executive", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "executive.html"));
});

/* ---------------- API ROUTES (KEEP YOUR EXISTING ONES BELOW IF ANY) ---------------- */
// app.get("/inventory", ...)
// app.post("/add-medicine", ...)

/* ---------------- SERVER START ---------------- */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running on port", PORT);
});