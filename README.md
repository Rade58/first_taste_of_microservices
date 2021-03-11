# HANDLING GET REQUEST FOR QUERY SERVICE

- `code query/index.js`

```js
const express = require("express");
const cors = require("cors");
const { json } = require("body-parser");

const app = express();

app.use(cors());
app.use(json());

const posts = {
  /* "placeholder post Id": {
    id: "same post id",
    title: "posts title",
    comments: [
      { id: "comment id", content: "stuff", postId: "you know" },
    ],
  }, */
};

// HANDLING GET FOR /posts
app.get("/posts", async (req, res) => {
  //

  res.send(posts);
});

app.post("/events", async (req, res) => {
  const { type, payload } = req.body;

  if (type === "PostCreated") {
    posts[payload.id] = { ...payload, comments: [] };
  }

  if (type === "CommentCreated") {
    const postId = payload.postId;

    posts[postId]["comments"].push({
      id: payload.id,
      content: payload.content,
      postId,
    });
  }

  res.send({});
});

const port = 4002;

app.listen(port, () => {
  console.log(`Query Service on: http://localhost:${port}`);
});

```

LIKE YOU SAW, I SENDING WHOLE POSTS, EVERY DOCUMENT

# TIME TO MANUALY TEST EVERYTHING

YOU'LL HAVE MANY TERMINALS

- `yarn start`

NEW TERMINAL

- `cd /event_bus` `yarn start`

NEW TERMINAL

- `cd /posts` `yarn start`

NEW TERMINAL

- `cd /comments` `yarn start`

NEW TERMINAL

- `cd /query` `yarn start`

**OK, NOW OPEN REACT APP AND MAKE A ONE POST, RELOAD, MAKE A FEW MORE POSTS, THAN RELOAD, ADD A COMMENT, ADD MORE COMMENTS; YOU DON'T NEED TO RELAOAD ANYMOTE**

**NOW TRY HITTING QUERY SERVICE WITH A GET FOR /posts ROUTE** (YOU CAN USE `httpie`)



