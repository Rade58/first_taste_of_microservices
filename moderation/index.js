const express = require("express");
const axios = require("axios");
const { json } = require("body-parser");

const app = express();

app.use(json());

app.post("/events", async (req, res) => {
  const { type, payload } = req.body;
});

const port = 4003;
app.listen(port, () => {
  console.log(`moderation service on: http://localhost:${port}`);
});
