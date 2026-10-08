import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  host: "localhost",
  port: 5432,
  database: "disaster_watch",
  user: "postgres",
  password: process.env.DB_PASSWORD,
});

pool
  .query("SELECT NOW()")
  .then(({ rows }) => {
    console.log("Database connected successfully!");
    console.log("Database time:", rows[0].now);
  })
  .catch((error) => {
    console.error("Database connection failed:", error.message);
  });

export default pool;
