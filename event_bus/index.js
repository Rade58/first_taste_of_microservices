const express = require("express");
const axios = require("axios");
const { json, urlencoded } = require("body-parser");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

const sendNotification = (url, event) => {
  return axios.post(url, event);
};

// I ADDED sendNotification FOR THE MODERATION SERVICE

app.post("/events", (req, res) => {
  const event = req.body;

  sendNotification("http://localhost:4000/events", event);
  sendNotification("http://localhost:4001/events", event);
  sendNotification("http://localhost:4002/events", event);
  // JUST THIS LINE OF CODE
  sendNotification("http://localhost:4003/events", event);
  //

  res.send({ status: "OK" });
});

const port = 4005;

app.listen(port, () => {
  console.log(`Event Bus on: http://localhost:${port}`);
});
