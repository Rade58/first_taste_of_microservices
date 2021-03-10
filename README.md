# SENDING EVENTS TO EVENT BUS

I WILLL MODIFY EACH SERVICE TO SEND EVENTS TO THE BUS

POSTS SERVICE WILL SEND AN EVENT WHEN NEW POST GETS CREATED

COMMENTS SERVICE WILL SEND AN EVENT WHEN NEW COMMENTS GETS CREATED

# POSTS SERVICE

- `code posts/index.js`

```js
const express = require("express");
const { json, urlencoded } = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const { default: axios } = require("axios");

// NOW I NEED axios

const app = express();

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

const posts = { someid: { id: "someid", title: "foo bar baz" } };

app.get("/posts", (req, res) => {
  res.status(200).send(posts);
});

// FROM HERE I WILL SEND EVENT TO THE BUS
app.post("/posts", async (req, res) => {
  const { title } = req.body;
  const id = randomBytes(4).toString("hex");
  posts[id] = { id, title };

  try {
    // HERE YOU GO

    const response = await axios.post(
      "http://localhost:4005/events",
      // HERE IS AN EVENT YOU RE SENDING
      {
        type: "PostCreated",
        // I'LL SEND DATA AS A payload
        payload: posts[id],
      }
    );
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

```
