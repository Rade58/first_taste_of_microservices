const express = require("express");
const { json, urlencoded } = require("body-parser");
const { randomBytes } = require("crypto");

const app = express();

// MIDDLEWARES
app.use(json());
app.use(urlencoded({ extended: true }));
//

// FAKE IN MEMORY DATBASE
// IT WILLL BE DESTROYED WHEN YOU RESTART SERVER
const posts = { "placeholder id": "foo bar baz" };
//

app.get("/posts", (req, res) => {
  res.status(200).send(posts);
});

app.post("/posts", (req, res) => {
  const { title } = req.body;

  const id = randomBytes(4).toString("hex");

  posts[id] = { id, title };

  res.status(201).send(posts[id]);
});

const port = 4000;

app.listen(port, () => {
  console.log(`listening on: http://localhost:${port}`);
});
