const express = require("express");
const { json, urlencoded } = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");

// TAKING axios
const axios = require("axios");
//

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
      },
    ],
  },
};

app.get("/posts/:id/comments", (req, res) => {
  const { id: postId } = req.params;

  if (commentsByPostId[postId]) {
    res.status(200).send(commentsByPostId[postId]);
  } else {
    res.status(404).end();
  }

  //
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

const port = 4001;

app.listen(port, () => {
  console.log(`Comments service on: http://localhost:${port}`);
});
