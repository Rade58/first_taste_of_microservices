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
        // OK WE WILL ADD A status TO THIS 'PLACEHOLDER'
        status: "pending",
      },
    ],
  },
};

app.post("/events", async (req, res) => {
  const { type, payload } = req.body;

  console.log({ type, payload });
});

// --------------------------------------------------------

app.get("/posts/:id/comments", (req, res) => {
  const { id: postId } = req.params;

  if (commentsByPostId[postId]) {
    res.status(200).send(commentsByPostId[postId]);
  } else {
    res.status(404).end();
  }

  //
});

app.post("/posts/:id/comments", async (req, res) => {
  const { id: postId } = req.params;

  const { content } = req.body;

  const id = randomBytes(4).toString("hex");

  // WE WILL ADD PENDING STATUS FOR EVERY CREATED COMMENT
  const status = "pending";

  if (commentsByPostId[postId]) {
    commentsByPostId[postId].comments.push({
      content,
      id,
      // ADDING STATUS
      status,
    });
  } else {
    commentsByPostId[postId] = {
      postId,
      comments: [
        {
          id,
          content,
          // HERE TOO
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
        // ADDING status HERRE TOO
        status,
      },
    });
  } catch (err) {
    console.error(err, "Couldn't send an event");
  }

  // HERE WE CAN SRND STATUS TOO (I DON'T THINK IT IS IMPORTANT TO BE ADDED HERE
  // BECAUSE OF NATURE OF MY PROJECT BUT I LEVE IT, IT WON'T MESS ANYTHING)
  res.status(201).send({ id, content, status });
});

const port = 4001;

app.listen(port, () => {
  console.log(`Comments service on: http://localhost:${port}`);
});
