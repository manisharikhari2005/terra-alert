const express = require("express");
const router = express.Router();

const {
  getAlerts,
  postAlert,
  patchAlert,
  removeAlert,
} = require("../controllers/alertController");

router.get("/", getAlerts);
router.post("/", postAlert);
router.patch("/:id", patchAlert);
router.delete("/:id", removeAlert);

module.exports = router;
