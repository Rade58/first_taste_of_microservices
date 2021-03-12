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
    console.log({ payload });

    const postId = payload.postId;

    if (postId) {
      // WE ARE DOING THIS HERE
      if (posts[postId] && posts[postId]["comments"]) {
        posts[postId]["comments"].push({
          id: payload.id,
          content: payload.content,
          postId,
          // HERE YOU GO
          status: payload.status,
        });
      }
    }
  }

  // OK HERE WE ARE GOING TO HANDLE "CommentUpdated"

  if (type === "CommentUpdated") {
    const postId = payload.postId;

    // console.log({ posts, type });

    // WE ARE UPDATING 'DATABASE' OF QUERY SERVICE

    if (posts[postId] !== undefined && posts[postId]["comments"]) {
      posts[payload.postId]["comments"].filter((comment) => {
        if (comment.id !== payload.id) {
          return comment;
        } else {
          return {
            ...comment,
            content: payload.content,
            status: payload.status,
          };
        }
      });
    }
  }

  res.send({});
});

const port = 4002;

app.listen(port, () => {
  console.log(`Query Service on: http://localhost:${port}`);
});
