const express = require("express");
const app = express();
const pool = require("./config/db");
const PORT = 5000;
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Disaster watch backend is runnig ");
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Disaster Watch backend is healthy",
  });
});

app.get("/api/alerts", async (req, res) => {
  try {
    console.log(req.query);

   const { severity, type, location } = req.query;

    let query = "SELECT * FROM alerts WHERE 1=1";
    const values = [];

    if (severity) {
      values.push(severity);
      query += ` AND severity = $${values.length}`;
    }

    if (type) {
      values.push(type);
      query += ` AND type = $${values.length}`;
    }
    if (location) {
      values.push(`%${location}%`);
      query += ` AND location ILIKE $${values.length}`;
    }

    const result = await pool.query(query, values);
  } catch (error) {
    console.error("Error fetching alerts:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch alerts",
    });
  }
});

app.post("/api/alerts", async (req, res) => {
  try {
    const { type, location, severity, details, source, occurred_at } = req.body;

    if (
      typeof type !== "string" ||
      !type.trim() ||
      typeof location !== "string" ||
      !location.trim() ||
      typeof severity !== "string" ||
      !severity.trim() ||
      typeof source !== "string" ||
      !source.trim() ||
      !occurred_at
    ) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing or invalid",
      });
    }
    const allowedSeverities = ["Low", "Medium", "High", "Critical"];
    if (!allowedSeverities.includes(severity)) {
      return res.status(400).json({
        success: false,
        message: "Invalid severity",
      });
    }

    if (typeof occurred_at !== "string") {
      return res.status(400).json({
        success: false,
        message: "occurred_at must be a string",
      });
    }
    if (Number.isNaN(Date.parse(occurred_at))) {
      return res.status(400).json({
        success: false,
        message: "Invalid occurred_at date",
      });
    }

    const result = await pool.query(
      `INSERT INTO alerts (type, location, severity, details, source, occurred_at)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [type, location, severity, details, source, occurred_at],
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error creating alert:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to create alert",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Backend is running on http://localhost:${PORT}`);
});
