# HANDLING "CommentModerated" EVENT ISIDE COMMENTS SERVICE; AND HANDLING "CoommentUpdated" INSIDE QUERY AERVICES

- `code comments/index.js`

```js
const express = require("express");
const { json, urlencoded } = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

const commentsByPostId = {
  "post id": {
    id: "post id",

    comments: [
      {
        id: "",
        content: "",
        status: "pending",
      },
    ],
  },
};

// HANDLING "CommentModerated"
app.post("/events", async (req, res) => {
  const { type, payload } = req.body;

  if (type === "CommentModerated") {
    const { postId, status, content, id } = payload;
    // WE WILL FIRST STORE MODERATED COMMENT

    // BUT WE NEED TO FILTER (MAYBE THIS IS USELESS)
    commentsByPostId[postId]["comments"].filter((comment) => {
      if (comment.id !== id) {
        return comment;
      } else {
        return { ...comment, status };
      }
    });

    // THEN WE ARE SENDING "CommentUpdated" TO EVENT BUS

    await axios.post("http://loclhost:4005/events", {
      type: "CommentUpdated",
      payload: {
        id,
        postId,
        content,
        status,
      },
    });

    return res.send({});
  }

  res.end();
});

app.get("/posts/:id/comments", (req, res) => {
  const { id: postId } = req.params;

  if (commentsByPostId[postId]) {
    res.status(200).send(commentsByPostId[postId]);
  } else {
    res.status(404).end();
  }
});

app.post("/posts/:id/comments", async (req, res) => {
  const { id: postId } = req.params;

  const { content } = req.body;

  const id = randomBytes(4).toString("hex");

  const status = "pending";

  if (commentsByPostId[postId]) {
    commentsByPostId[postId].comments.push({
      content,
      id,
      status,
    });
  } else {
    commentsByPostId[postId] = {
      postId,
      comments: [
        {
          id,
          content,
          status,
        },
      ],
    };
  }

  try {
    await axios.post("http://localhost:4005/events", {
      type: "CommentCreated",
      payload: {
        postId,
        id,
        content,
        status,
      },
    });
  } catch (err) {
    console.error(err, "Couldn't send an event");
  }

  res.status(201).send({ id, content, status });
});

const port = 4001;

app.listen(port, () => {
  console.log(`Comments service on: http://localhost:${port}`);
});
```

NOW WE NEED TO HANDLE "CommentUpdted" INSIDE QUERY SERVICE

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
      { id: "comment id", content: "stuff", postId: "you know", status: "pending or rejected or approved" },
    ],
  }, */
};

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

    // WE ARE DOING THIS HERE

    posts[postId]["comments"].push({
      id: payload.id,
      content: payload.content,
      postId,
      // HERE YOU GO
      status: payload.status,
    });
  }

  // OK HERE WE ARE GOING TO HANDLE "CommentUpdated"

  if (type === "CommentUpdated") {
    // WE ARE UPDATING 'DATABASE' OF QUERY SERVICE
    posts[payload.postId]["comments"].filter((comment) => {
      if (comment.id !== payload.id) {
        return comment;
      } else {
        return { ...comment, status: payload.status };
      }
    });
  }

  res.send({});
});

const port = 4002;

app.listen(port, () => {
  console.log(`Query Service on: http://localhost:${port}`);
});

```
