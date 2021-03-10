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
      },
    ],
  },
};

// ADDING /events HANDLER ---------------------------------

app.post("/events", async (req, res) => {
  console.log("/eventS COMMENT HITTED");

  const { type, payload } = req.body;

  // I WILL JUST CONSOLE LOG STUFF FOR NOW
  console.log({ type, payload });

  // BECAUSE COMMENT SERVICE ALREDY KNOWS THAT COMMENT IS CREATED
  /* if (type === "CommentCreated") {
    return res.end();
  } */
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

// I WILL SEND EVENT TO THE EVENT BUS
// AN EVENT THAT INDICATES THAT NEW COMMENT IS CREATED
// AND ALSO SENDS THAT COMMENT IN A PAYLOAD

app.post("/posts/:id/comments", async (req, res) => {
  const { id: postId } = req.params;

  const { content } = req.body;

  const id = randomBytes(4).toString("hex");

  if (commentsByPostId[postId]) {
    commentsByPostId[postId].comments.push({
      content,
      id,
    });
  } else {
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

  // SENDING EVENT FROM HERE BECAUSE
  // HERE I KNOW THAT COMMENT IS CREATED (JOB OF CREATION IS ALREDY FINISHED HERE)
  try {
    const response = await axios.post("http://localhost:4005/events", {
      type: "CommentCreated",
      payload: {
        postId,
        id,
        content,
      },
    });
  } catch (err) {
    console.error(err, "Couldn't send an event");
  }

  res.status(201).send({ id, content });
});

const port = 4001;

app.listen(port, () => {
  console.log(`Comments service on: http://localhost:${port}`);
});
