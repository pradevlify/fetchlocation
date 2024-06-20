const express = require("express");
const app = express();
const cors = require("cors");
const db = require("./db");

//middleware
app.use(express.json());
app.use(cors());

app.post("/addlocation", (req, res) => {
  const { lat, long, datetime, deviceid } = req.body;

  // Input validation (basic example, you might want more checks)
  if (!lat || !long || !datetime || !deviceid) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // SQL query to insert data
  const query = `
        INSERT INTO location (latitude, longitude, datetime, deviceid)
        VALUES (?, ?, ?, ?)
      `;

  // Execute the query
  db.query(query, [lat, long, datetime, deviceid], (error, results) => {
    if (error) {
      return res.status(500).json({ error: "Database error", details: error });
    }
    res.status(200).json({
      message: "Location added successfully",
      data: {
        deviceid: deviceid,
        latitude: lat,
        longitude: long,
        datetime: datetime,
      },
    });
  });
});

app.get("/locations", (req, res) => {
  const query = "SELECT * FROM location";

  db.query(query, (error, results) => {
    if (error) {
      return res.status(500).json({ error: "Database error", details: error });
    }
    res.status(200).json({
      message: "Locations fetched successfully",
      data: results,
    });
  });
});
// Start the server
app.listen(4000, () => {
  console.log(`Server is running`);
});
