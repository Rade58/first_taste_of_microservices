const express = require("express");
const axios = require("axios");
const { json } = require("body-parser");

const app = express();

// WE HAVE ANOTHER DATBASE
// THIS WILL BE A DATABSE OF COMMNTS

const comments = {
  /* "comment id": {
    id: "comment id",
    content: "",
    postId: ""
  } */
};

app.use(json());

// ANTICIPATING ECHO FROM EVENT BUS
app.post("/events", async (req, res) => {
  const { type, payload } = req.body;

  // TYPE WE ARE ANTICIPATING IS COMMENT CREATION
  if (type === "CommentCreation") {
    // IN HERE I WILL DO MODERATION
    // AFTER WE ARE DONE WITH MODERATION
    // WE SHOULD EMMIT "CommentModerated"
    // WITH AXIOS
    // AND "CommentModerated" WILL BE ANTICIPATED BY COMMENTS
    // SERVICE
  }
});

const port = 4003;
app.listen(port, () => {
  console.log(`moderation service on: http://localhost:${port}`);
});
