const express = require("express");
const axios = require("axios");
const { json, urlencoded } = require("body-parser");
const cors = require("cors");

const app = express();

// THIS IS EVENTS DATABASE
const events = [];

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

app.post("/events", (req, res) => {
  const event = req.body;

  // WE WILL STORE INCOMMING EVENT
  events.push(event);
  //

  axios.post("http://localhost:4000/events", event);
  axios.post("http://localhost:4001/events", event);
  axios.post("http://localhost:4002/events", event);
  axios.post("http://localhost:4003/events", event);

  res.send({ status: "OK" });
});

const port = 4005;

app.listen(port, () => {
  console.log(`Event Bus on: http://localhost:${port}`);
});
