const express = require("express");
const cors = require("cors");
const { json } = require("body-parser");

const app = express();

app.use(cors());
app.use(json());

// FIRS LETS ADD DATA STRUCTURE FOR STORING STUFF
// A FAKE DATABASE, BECAUSE I AM DOING THINGS IN MEMORY
// FOR THIS PROJECT (I DON'T HAVE DATABASE)
const posts = {
  // THIS IS DICTIONARY
  // AND ONE DOCUMENT WOULD LOOK LIKE THIS
  /* "placeholder post Id": {
    id: "same post id",
    title: "posts title",
    comments: [
      // comments associated with one post
      { id: "comment id", content: "stuff" },
    ],
  }, */
};

app.get("/posts", async (req, res) => {
  // -
});

// LETS HANDLE EVENTS
app.post("/events", async (req, res) => {
  // I'LL LEAVE THIS EMPTY FOR NOW
});

const port = 4002;

app.listen(port, () => {
  console.log(`Query Service on: http://localhost:${port}`);
});
