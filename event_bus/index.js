const express = require("express");
const axios = require("axios");
const { json, urlencoded } = require("body-parser");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

app.post("/events", async (req, res) => {
  // TAKING EVENT
  const event = req.body;

  console.log("COMMENT COMMENT");

  // SENDING NOTIFICATIONS TO ALL SERVICES

  // TO POSTS SERVICE
  try {
    await axios.post("http://localhost:4000/events", event);
  } catch (err) {
    console.error(err);
  }

  // TO COMMENTS SERVICE
  try {
    await axios.post("http://localhost:4001/events", event);
  } catch (err) {
    console.error(err);
  }
  // TO QUERY SERVICE
  try {
    await axios.post("http://localhost:4002/events", event);
  } catch (err) {
    console.error(err);
  }

  // JUST TO INDICATE THAT EVERYTHING IS WORKING AS EXPECTED
  res.send({ status: "OK" });
});

const port = 4005;

app.listen(port, () => {
  console.log(`Event Bus on: http://localhost:${port}`);
});
