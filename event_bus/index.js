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

  // SENDING NOTIFICATIONS TO ALL SERVICES

  // TO POSTS SERVICE
  try {
    console.log("SENDING TO POST SERVICE");
    await axios.post("http://localhost:4000/events", event);
  } catch (err) {
    console.log("Something Happened post");
  }

  // TO COMMENTS SERVICE
  try {
    console.log("SENDING TO COMMENT SERVICE");
    await axios.post("http://localhost:4001/events", event);
  } catch (err) {
    console.log("Something Happened comment");
  }
  // TO QUERY SERVICE
  try {
    console.log("SENDING TO QUERY SERVICE");
    await axios.post("http://localhost:4002/events", event);
  } catch (err) {
    console.log("Something Happened query");
  }

  // JUST TO INDICATE THAT EVERYTHING IS WORKING AS EXPECTED
  res.send({ status: "OK" });
});

const port = 4005;

app.listen(port, () => {
  console.log(`Event Bus on: http://localhost:${port}`);
});
