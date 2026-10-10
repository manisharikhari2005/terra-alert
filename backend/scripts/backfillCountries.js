import pool from "../config/db.js";
import { backfillAlertCountries } from "../services/earthquakeService.js";

try {
  const result = await backfillAlertCountries();
  console.log("Final result:", result);
} catch (error) {
  console.error("Country backfill failed:", error);
  process.exitCode = 1;
} finally {
  await pool.end();
}
