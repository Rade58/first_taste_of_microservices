const express = require("express");
const { json, urlencoded } = require("body-parser");
const { randomBytes } = require("crypto");

console.log("SERVER SERVER SERVER");

const app = express();

app.use(json());
// app.use(urlencoded({ extended: true }));

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

app.get("/blah", (req, res) => {
  //
  res.status(200).send({ test });
});

app.post("/posts/:id/comments", (req, res) => {
  console.log(req.params, req.body);

  const { id: postId } = req.params;

  const { content } = req.body;

  const id = randomBytes(4).toString("hex");

  // IF POST EXISTING (IF YOU STORED COMMENTS BEFORE, YOU HAVE EXISTING
  // ARRAY OF COMMENTS)

  if (commentsByPostId[postId]) {
    commentsByPostId[postId].comments.push({
      content,
      id,
    });
  } else {
    // STORING FIRST EVER COMMENT
    commentsByPostId[postId] = {
      postId,
      comments: [
        {
          id,
          content,
        },
      ],
    };
  }

  // SENDING CREATED COMMENT
  res.status(201).send({ id, content });
});

const port = 5001;

app.listen(port, () => {
  console.log(`Comments service on: http://localhost:${port}`);

  console.log("SERVER SERVER SERVER");
});
