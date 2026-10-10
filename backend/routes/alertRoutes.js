import express from "express";
import {
  getAlerts,
  getAlert,
  postAlert,
  patchAlert,
  removeAlert,
  getCountriesCount,
} from "../controllers/alertController.js";

const router = express.Router();

router.get("/", getAlerts);
router.get("/countries/count", getCountriesCount);
router.get("/:id", getAlert);
router.post("/", postAlert);
router.patch("/:id", patchAlert);
router.delete("/:id", removeAlert);

export default router;
