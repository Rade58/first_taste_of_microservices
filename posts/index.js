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

// I WILL ADD HANDLER FOR /events ROUTE
app.post("/events", async (req, res) => {
  const { type, payload } = req.body;

  // I WILL JUST CONSOLE LOG STUFF FOR NOW
  console.log({ type, payload });

  // BECAUSE POST SERVICE ALREDY KNOWS THAT POST IS CREATED
  /* if (type === "PostCreated") {
    return res.end();
  }
 */
  res.send({});
});

// ---------------------------------

app.get("/posts", (req, res) => {
  res.status(200).send(posts);
});

app.post("/posts", async (req, res) => {
  const { title } = req.body;
  const id = randomBytes(4).toString("hex");
  posts[id] = { id, title };

  try {
    const response = await axios.post("http://localhost:4005/events", {
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
  console.log(`listening on: http://localhost:${port}`);
});
