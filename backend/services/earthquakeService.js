import pool from "../config/db.js";

const USGS_API_URL =
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson";

const getEarthquakeSeverity = (magnitude) => {
  if (magnitude === null || magnitude === undefined) {
    return "Low";
  }

  if (magnitude >= 5) {
    return "High";
  }

  if (magnitude >= 2) {
    return "Medium";
  }

  return "Low";
};

const fetchEarthquakes = async () => {
  const response = await fetch(USGS_API_URL);

  if (!response.ok) {
    throw new Error(`USGS API error: ${response.status}`);
  }

  const data = await response.json();

  if (!Array.isArray(data.features)) {
    throw new Error("Invalid earthquake data received from USGS");
  }

  return data.features;
};

const normalizeEarthquake = (feature) => {
  const { properties, geometry, id } = feature;

  if (!properties || !geometry?.coordinates) {
    throw new Error("Invalid earthquake feature received from USGS");
  }

  const [longitude, latitude, depth] = geometry.coordinates;

  return {
    externalId: id,
    type: "Earthquake",
    location: properties.place,
    magnitude: properties.mag,
    latitude,
    longitude,
    depth,
    occurredAt: new Date(properties.time).toISOString(),
    source: "USGS",
    eventData: feature,
  };
};

const getNormalizedEarthquakes = async () => {
  const earthquakes = await fetchEarthquakes();

  return earthquakes.map(normalizeEarthquake);
};

const saveEarthquakes = async () => {
  const earthquakes = await getNormalizedEarthquakes();

  let inserted = 0;
  let updated = 0;
  let unchanged = 0;

  for (const earthquake of earthquakes) {
    const result = await pool.query(
      `INSERT INTO alerts (
        type,
        location,
        severity,
        details,
        latitude,
        longitude,
        source,
        occurred_at,
        event_data,
        external_id,
        magnitude,
        depth
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)

      ON CONFLICT (source, external_id)
      WHERE external_id IS NOT NULL
      DO UPDATE SET
        type = EXCLUDED.type,
        location = EXCLUDED.location,
        details = EXCLUDED.details,
        latitude = EXCLUDED.latitude,
        longitude = EXCLUDED.longitude,
        occurred_at = EXCLUDED.occurred_at,
        event_data = EXCLUDED.event_data,
        magnitude = EXCLUDED.magnitude,
        depth = EXCLUDED.depth
      WHERE
        (alerts.type, alerts.location, alerts.details,
         alerts.latitude, alerts.longitude, alerts.occurred_at,
         alerts.event_data, alerts.magnitude, alerts.depth)
        IS DISTINCT FROM
        (EXCLUDED.type, EXCLUDED.location, EXCLUDED.details,
         EXCLUDED.latitude, EXCLUDED.longitude, EXCLUDED.occurred_at,
         EXCLUDED.event_data, EXCLUDED.magnitude, EXCLUDED.depth)

      RETURNING (xmax = 0) AS inserted`,
      [
        earthquake.type,
        earthquake.location,
        getEarthquakeSeverity(earthquake.magnitude),
        `Magnitude ${earthquake.magnitude ?? "Unknown"}`,
        earthquake.latitude,
        earthquake.longitude,
        earthquake.source,
        earthquake.occurredAt,
        JSON.stringify(earthquake.eventData),
        earthquake.externalId,
        earthquake.magnitude,
        earthquake.depth,
      ],
    );

    if (result.rowCount === 0) {
      unchanged++;
    } else if (result.rows[0].inserted) {
      inserted++;
    } else {
      updated++;
    }
  }

  return { inserted, updated, unchanged };
};

export {
  fetchEarthquakes,
  normalizeEarthquake,
  getNormalizedEarthquakes,
  saveEarthquakes,
};
