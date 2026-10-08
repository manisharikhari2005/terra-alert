import cors from "cors";
import express from "express";
import errorHandler from "./middleware/errorHandler.js";
import alertRoutes from "./routes/alertRoutes.js";
import startEarthquakeJob from "./jobs/earthquakeJob.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use("/api/alerts", alertRoutes);

app.get("/", (req, res) => {
  res.send("Disaster Watch backend is running");
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Disaster Watch backend is healthy",
  });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Backend is running on http://localhost:${PORT}`);
  startEarthquakeJob();
});
