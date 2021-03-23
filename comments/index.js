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
  /* "post id": {
    id: "post id",

    comments: [
      {
        id: "",
        content: "",
        status: "pending",
      },
    ],
  }, */
};

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

  const commentId = randomBytes(4).toString("hex");

  const startingStatus = "pending";

  const comments = commentsByPostId[postId] || [];

  comments.push({ id: commentId, content, status: startingStatus });

  commentsByPostId[postId] = comments;

  // UMESTO OVOGA
  // await axios.post("http://localhost:4005/events", {
  // OVO
  await axios.post("http://event-bus-srv:4005/events", {
    type: "CommentCreated",
    payload: {
      postId,
      id: commentId,
      content,
      status: startingStatus,
    },
  });
  return res
    .status(201)
    .send({ id: commentId, content, status: startingStatus });
});

app.post("/events", async (req, res) => {
  const { type, payload } = req.body;

  if (type === "CommentModerated") {
    const { postId, status: newStatus, content, id } = payload;
    console.log({ newStatus });

    const comment = commentsByPostId[postId].find((val, index) => {
      return val.id === id;
    });

    comment.status = newStatus;

    // UMESTO OVOGA
    // await axios.post("http://localhost:4005/events", {
    // OVO
    await axios.post("http://event-bus-srv:4005/events", {
      type: "CommentUpdated",
      payload: {
        id,
        postId,
        content,
        status: newStatus,
      },
    });
  }

  return res.send({});
});

const port = 4001;

app.listen(port, () => {
  console.log(`Comments service on: http://localhost:${port}`);
});
