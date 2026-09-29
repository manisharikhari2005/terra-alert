const pool = require("../config/db");

const getAllAlerts = async (filters) => {
  const { severity, type, location } = filters;

  let query = "SELECT * FROM alerts WHERE 1=1";
  const values = [];

  if (severity) {
    values.push(severity);
    query += ` AND severity = $${values.length}`;
  }

  if (type) {
    values.push(type);
    query += ` AND type = $${values.length}`;
  }

  if (location) {
    values.push(`%${location}%`);
    query += ` AND location ILIKE $${values.length}`;
  }

  const result = await pool.query(query, values);
  return result.rows;
};

const createAlert = async (alertData) => {
  const { type, location, severity, details, source, occurred_at } = alertData;

  const result = await pool.query(
    `INSERT INTO alerts
      (type, location, severity, details, source, occurred_at)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [type, location, severity, details, source, occurred_at],
  );

  return result.rows[0];
};

const updateAlert = async (id, alertData) => {
  const { type, location, severity, details, source, occurred_at } = alertData;

  const allowedFields = {
    type,
    location,
    severity,
    details,
    source,
    occurred_at,
  };

  const updates = Object.entries(allowedFields).filter(
    ([key, value]) => value !== undefined,
  );

  const values = [];

  const setClause = updates.map(([key, value], index) => {
    values.push(value);
    return `${key} = $${index + 1}`;
  });

  values.push(id);

  const query = `
    UPDATE alerts
    SET ${setClause.join(", ")}
    WHERE id = $${values.length}
    RETURNING *
  `;

  const result = await pool.query(query, values);

  return result.rows[0] || null;
};

const deleteAlert = async (id) => {
  const result = await pool.query(
    "DELETE FROM alerts WHERE id = $1 RETURNING *",
    [id],
  );

  return result.rows[0] || null;
};

module.exports = {
  getAllAlerts,
  createAlert,
  updateAlert,
  deleteAlert,
};
