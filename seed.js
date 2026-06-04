const { Pool } = require("pg");

const pool = new Pool({
    user: "lyveenkiio",
    host: "localhost",
    database: "healthcare",
    port: 5432
});

// BIG MOCK HOSPITAL INVENTORY
const medicines = [
    { qr_id: "MED001", name: "Paracetamol 500mg", batch: "BATCH-A1", expiry: "2026-12-01", qty: 500, reorder: 100 },
    { qr_id: "MED002", name: "Amoxicillin 250mg", batch: "BATCH-A2", expiry: "2026-10-15", qty: 300, reorder: 80 },
    { qr_id: "MED003", name: "Ibuprofen 400mg", batch: "BATCH-A3", expiry: "2027-01-10", qty: 450, reorder: 120 },
    { qr_id: "MED004", name: "Cough Syrup", batch: "BATCH-B1", expiry: "2026-08-20", qty: 200, reorder: 50 },
    { qr_id: "MED005", name: "Antibiotic Ointment", batch: "BATCH-B2", expiry: "2027-03-05", qty: 150, reorder: 40 },
    { qr_id: "MED006", name: "Vitamin C Tablets", batch: "BATCH-C1", expiry: "2027-06-11", qty: 800, reorder: 150 },
    { qr_id: "MED007", name: "Insulin Injection", batch: "BATCH-C2", expiry: "2026-09-30", qty: 120, reorder: 30 },
    { qr_id: "MED008", name: "Saline Solution", batch: "BATCH-D1", expiry: "2028-01-01", qty: 1000, reorder: 200 },
    { qr_id: "MED009", name: "Aspirin 100mg", batch: "BATCH-D2", expiry: "2026-11-25", qty: 600, reorder: 100 },
    { qr_id: "MED010", name: "Antihistamine Tablets", batch: "BATCH-D3", expiry: "2027-04-18", qty: 350, reorder: 90 }
];

async function seed() {
    try {
        for (let med of medicines) {
            await pool.query(
                `INSERT INTO medicines 
                (qr_id, name, batch_number, expiry_date, quantity, reorder_level)
                VALUES ($1,$2,$3,$4,$5,$6)
                ON CONFLICT (qr_id) DO NOTHING`,
                [med.qr_id, med.name, med.batch, med.expiry, med.qty, med.reorder]
            );
        }

        console.log("✅ Mock hospital inventory loaded successfully!");
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seed();