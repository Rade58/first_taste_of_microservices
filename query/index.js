const express = require("express");
const cors = require("cors");
const { json } = require("body-parser");
const { default: axios } = require("axios");

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
  console.log({ posts });
  res.send(posts);
});

// ----------- ADDING HELPER FOR HANDLING EVENTS
// STORRING STUFF ON DIFFERENT EVENTS

const handleEvent = (type, payload) => {
  if (type === "PostCreated") {
    const { id, title } = payload;

    posts[id] = { id, title, comments: [] };
  }

  if (type === "CommentCreated") {
    const { id, postId, content, status } = payload;

    posts[postId].comments.push({ id, content, status });
  }

  if (type === "CommentUpdated") {
    const { id, postId, status, content } = payload;

    console.log({ status });

    const comments = posts[postId].comments;

    const comment = comments.find((val, index) => {
      return val.id === id;
    });

    comment.status = status;
    comment.content = content;
  }
};

// ------------------------------------------------

app.post("/events", async (req, res) => {
  const { type, payload } = req.body;

  handleEvent(type, payload);

  res.send({});
});

const port = 4002;

app.listen(port, () => {
  console.log(`Query Service on: http://localhost:${port}`);
});
