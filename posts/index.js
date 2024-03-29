const express = require("express");
const { json, urlencoded } = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const { default: axios } = require("axios");

const app = express();

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

const posts = { someid: { id: "someid", title: "foo bar baz" } };

app.post("/events", async (req, res) => {
  const { type, payload } = req.body;

  console.log({ type, payload });

  res.send({});
});

app.get("/posts", (req, res) => {
  res.status(200).send(posts);
});

// EVO KAKO VIDIS OVAJ ROUTE JE ODGOVORAN ZA KREIRANJE NOVOG POST
// DOKUMENTA U IN MEMORY DATABASE-U (OBICNOM JAVASCRIPT OBJEKTU)
// ALI KAKO VIDIS, NJEGOV ROUTE JE /posts
// app.post("/posts", async (req, res) => {
// MEDJUTIM JA SAM DEFINISAO DA INGRESS CONTROLLER DIRECT-UJE TRAFFIC TO /create
// ZATO SAM OVO IMENIO DA BU DE /create
app.post("/create", async (req, res) => {
  const { title } = req.body;
  const id = randomBytes(4).toString("hex");
  posts[id] = { id, title };

  try {
    const response = axios.post("http://event-bus-srv:4005/events", {
      type: "PostCreated",
      payload: posts[id],
    });
  } catch (err) {
    console.error("Something went wrong", err);
    res.end();
  }

  res.status(201).send(posts[id]);
});

const port = 4000;

app.listen(port, () => {
  console.log("v108");

  console.log(`listening on: http://localhost:${port}`);
});
