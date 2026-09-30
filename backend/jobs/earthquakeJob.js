const cron = require("node-cron");
const { saveEarthquakes } = require("../services/earthquakeService");

const startEarthquakeJob = () => {
  cron.schedule("*/5 * * * *", async () => {
    console.log("Starting earthquake data ingestion...");

    try {
      const result = await saveEarthquakes();

      console.log("Earthquake data ingestion completed.");
      console.log(`Inserted: ${result.inserted}`);
      console.log(`Updated: ${result.updated}`);
      console.log(`Unchanged: ${result.unchanged}`);
    } catch (error) {
      console.error("Earthquake ingestion failed:", error.message);
    }
  });

  console.log("Earthquake job scheduled: every 5 minutes");
};

module.exports = startEarthquakeJob;
