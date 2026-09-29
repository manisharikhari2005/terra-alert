const errorHandler = require("./middleware/errorHandler");
const express = require("express");
const app = express();
const pool = require("./config/db");
const alertRoutes = require("./routes/alertRoutes");
const PORT = 5000;
app.use(express.json());
app.use("/api/alerts", alertRoutes);

app.get("/", (req, res) => {
  res.send("Disaster watch backend is runnig ");
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
});
