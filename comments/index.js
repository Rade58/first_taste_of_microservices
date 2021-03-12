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
    console.log({ status });

    // WE ARE SENDING "CommentUpdated" TO EVENT BUS

    await axios.post("http://localhost:4005/events", {
      type: "CommentUpdated",
      payload: {
        id,
        postId,
        content,
        status: status,
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
