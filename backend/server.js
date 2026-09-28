const express = require("express");
const app = express();
const PORT = 5000;

app.get("/", (req, res) => {
  res.send("Disaster watch backend is runnig ");
});

app.get("/api/health", (req, res) => {
    res.json({
      success: true,
      message: "Disaster Watch backend is healthy",
    });
})

app.listen(PORT, () => {
    console.log(`Backend is running on http://localhost:${PORT}`);
    
})