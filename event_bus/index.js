const express = require("express");
const axios = require("axios");
const { json, urlencoded } = require("body-parser");
const cors = require("cors");

const app = express();

const events = [];

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

app.post("/events", (req, res) => {
  const event = req.body;

  events.push(event);

  // UMESTO OVOGA
  // axios.post("http://localhost:4000/events", event);
  // OVO
  axios.post("http://posts-srv:4000/events", event);
  // OSTALI JOS NISAM PROVEO KROZ KUBERNETES WORKFLOW
  // ALI TO PLANIRAM DA URADIM
  // I ATO COMMENTUJEM OVO OUT ZA SADA
  /* axios.post("http://localhost:4001/events", event);
  axios.post("http://localhost:4002/events", event);
  axios.post("http://localhost:4003/events", event); */

  res.send({ status: "OK" });
});

app.get("/events", (req, res) => {
  res.send(events);
});

const port = 4005;

app.listen(port, () => {
  console.log(`Event Bus on: http://localhost:${port}`);
});
