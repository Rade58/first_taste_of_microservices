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
    // console.log({ payload });

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

    console.log({ type });

    // WE ARE UPDATING 'DATABASE' OF QUERY SERVICE

    if (posts[postId] && posts[postId]["comments"]) {
      let i = 0;

      const comment = posts[postId]["comments"].find((val, index) => {
        if (val.postId === postId) {
          i = index;
          return true;
        } else {
          return false;
        }
      });

      comment.status = payload.status;

      posts[postId]["comments"][i] = comment;
    }
  }

  res.send({});
});

const port = 4002;

app.listen(port, () => {
  console.log(`Query Service on: http://localhost:${port}`);
});
