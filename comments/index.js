const express = require("express");
const { json, urlencoded } = require("body-parser");
const { randomBytes } = require("crypto");

const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));

// ANOTHER IN MEMORY DATABASE
//
const commentsByPostId = {
  "post id": {
    id: "post id",
    // ARRAY OF COMMENTS ASSOCIATED WIT A POST
    comments: [
      {
        // comment id
        id: "",
        content: "",
      },
    ],
  },
};

app.get("/posts/:id/comments", (req, res) => {
  //
});

app.post("/posts/:id/comments", (req, res) => {
  const { id: postId } = req.params;

  const { content } = req.body;

  const id = randomBytes(4).toString("hex");

  commentsByPostId[postId] = {
    id: postId,
    comments: [...commentsByPostId[postId], { id, content }],
  };

  res
    .status(201)
    .send(
      commentsByPostId[postId].comments[commentsByPostId[postId].length - 1]
    );
});

const port = 4001;

app.listen(() => {
  console.log(`Comments service on: http://localhost:${port}`);
});
