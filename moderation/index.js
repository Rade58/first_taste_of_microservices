const express = require("express");
const axios = require("axios");
const { json } = require("body-parser");

const app = express();

app.use(json());

// ANTICIPATING ECHO FROM EVENT BUS
app.post("/events", async (req, res) => {
  const { type, payload } = req.body;

  // TYPE WE ARE ANTICIPATING IS COMMENT CREATION
  if (type === "CommentCreated") {
    // IN HERE I WILL DO MODERATION
    // AFTER WE ARE DONE WITH MODERATION
    // WE SHOULD EMMIT "CommentModerated"
    // WITH AXIOS
    // AND "CommentModerated" WILL BE ANTICIPATED BY COMMENTS
    // SERVICE
    // I WILL MAKE A PUSE BEFORE DOING ALL THIS
  }
});

const port = 4003;
app.listen(port, () => {
  console.log(`moderation service on: http://localhost:${port}`);
});
