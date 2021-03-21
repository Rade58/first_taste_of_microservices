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

  // EVO OVO NE VALJA ATO STO, OPET NAPOMINJEM
  // MICROSERVISI AGAINST WHICH I'M MAKING A REQUEST
  // SU INSIDE THEIR OWN VIRTIAL MACHINES
  // ODNOSNO ONI SU INSIDE PODS, ODNOSNO INSIDE CONTAINERS

  // TACNIJE SAMO JE TAK OSA POSTS
  axios.post("http://localhost:4000/events", event);
  // OSTALI JOS NISAM PROVEO KROZ KUBERNETES WORKFLOW
  // ALI TO PLANIRAM DA URADIM
  axios.post("http://localhost:4001/events", event);
  axios.post("http://localhost:4002/events", event);
  axios.post("http://localhost:4003/events", event);

  res.send({ status: "OK" });
});

app.get("/events", (req, res) => {
  res.send(events);
});

const port = 4005;

app.listen(port, () => {
  console.log(`Event Bus on: http://localhost:${port}`);
});
