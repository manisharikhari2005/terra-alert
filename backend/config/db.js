require("dotenv").config();

const { Pool } = require("pg");

const pool = new Pool({
  host: "localhost",
  port: 5432,
  database: "disaster_watch",
  user: "postgres",
  password: process.env.DB_PASSWORD,
});

pool
  .query("SELECT NOW()")
  .then((result) => {
    console.log("Database connected successfully!");
    console.log("Database time:", result.rows[0].now);
  })
  .catch((error) => {
    console.error("Database connection failed:", error.message);
  });

module.exports = pool;
