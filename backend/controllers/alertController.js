import {
  getAllAlerts,
  getAlertById,
  createAlert,
  updateAlert,
  deleteAlert,
} from "../services/alertService.js";

const allowedSeverities = ["Low", "Medium", "High", "Critical"];

const isValidDate = (value) =>
  typeof value === "string" &&
  value.trim() !== "" &&
  !Number.isNaN(Date.parse(value));

const isValidOptionalDetails = (value) =>
  value === undefined || value === null || typeof value === "string";

// GET /api/alerts
const getAlerts = async (req, res, next) => {
  try {
    const alerts = await getAllAlerts(req.query);

    res.status(200).json({
      success: true,
      data: alerts,
    });
  } catch (error) {
    next(error);
  }
};
const getAlert = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!/^\d+$/.test(id) || Number(id) < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid alert ID",
      });
    }

    const alert = await getAlertById(id);

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: "Alert not found",
      });
    }

    res.status(200).json({
      success: true,
      data: alert,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/alerts
const postAlert = async (req, res, next) => {
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
      !isValidDate(occurred_at) ||
      !isValidOptionalDetails(details)
    ) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing or invalid",
      });
    }

    if (!allowedSeverities.includes(severity)) {
      return res.status(400).json({
        success: false,
        message: "Invalid severity",
      });
    }

    const alert = await createAlert({
      type: type.trim(),
      location: location.trim(),
      severity,
      details,
      source: source.trim(),
      occurred_at,
    });

    res.status(201).json({
      success: true,
      data: alert,
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/alerts/:id
const patchAlert = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { type, location, severity, details, source, occurred_at } = req.body;

    if (!/^\d+$/.test(id) || Number(id) < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid alert ID",
      });
    }

    const allowedFields = {
      type,
      location,
      severity,
      details,
      source,
      occurred_at,
    };

    const updates = Object.entries(allowedFields).filter(
      ([, value]) => value !== undefined,
    );

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one field is required",
      });
    }

    for (const [key, value] of updates) {
      if (
        ["type", "location", "severity", "source"].includes(key) &&
        (typeof value !== "string" || !value.trim())
      ) {
        return res.status(400).json({
          success: false,
          message: `Invalid ${key}`,
        });
      }
    }

    if (severity !== undefined && !allowedSeverities.includes(severity)) {
      return res.status(400).json({
        success: false,
        message: "Invalid severity",
      });
    }

    if (occurred_at !== undefined && !isValidDate(occurred_at)) {
      return res.status(400).json({
        success: false,
        message: "Invalid occurred_at date",
      });
    }

    if (details !== undefined && !isValidOptionalDetails(details)) {
      return res.status(400).json({
        success: false,
        message: "Invalid details",
      });
    }

    const cleanedUpdates = Object.fromEntries(
      updates.map(([key, value]) => [
        key,
        typeof value === "string" &&
        ["type", "location", "source"].includes(key)
          ? value.trim()
          : value,
      ]),
    );

    const alert = await updateAlert(id, cleanedUpdates);

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: "Alert not found",
      });
    }

    res.status(200).json({
      success: true,
      data: alert,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/alerts/:id
const removeAlert = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!/^\d+$/.test(id) || Number(id) < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid alert ID",
      });
    }

    const alert = await deleteAlert(id);

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: "Alert not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Alert deleted successfully",
      data: alert,
    });
  } catch (error) {
    next(error);
  }
};

export { getAlerts, getAlert, postAlert, patchAlert, removeAlert };
