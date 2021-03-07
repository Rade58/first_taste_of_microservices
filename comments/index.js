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
  console.log(req.params, req.body);

  const { id: postId } = req.params;

  const { content } = req.body;

  const id = randomBytes(4).toString("hex");

  // IF POST EXISTING (IF YOU STORED COMMENTS BEFORE)

  if (commentsByPostId[postId]) {
    commentsByPostId[postId].comments.push({
      content,
      id,
    });
  } else {
    commentsByPostId[postId] = {
      id: postId,
      comments: [
        {
          id,
          content,
        },
      ],
    };
  }

  res.status(201).send({ id, content });
});

const port = 4001;

app.listen(() => {
  console.log(`Comments service on: http://localhost:${port}`);
});
