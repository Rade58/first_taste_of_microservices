# ANTICIPATING NOTIFICATIONS FROM THE BUS

***

**ALSO I WILL CORRECT MISTAKES INSIDE EVENT BUS CODE**

***

I'M TALKING ABOUT OF ANTICIPATING INSDE SERVICE

NEED TO SET UP HANDLER WHO WILL HANDLE NOTIFICATIONS SENT FROM THE BUS

LIKE I SAID, ONLY EVENT BUS WILL HIT THOSE ROUTES

## ANTICIPATING NOTIFICATIONS INSIDE POSTS SERVICE

- `code posts/index.js`

```js
const express = require("express");
const { json, urlencoded } = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const { default: axios } = require("axios");

const app = express();

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

const posts = { someid: { id: "someid", title: "foo bar baz" } };

// I WILL ADD HANDLER FOR /events ROUTE
app.post("/events", async (req, res) => {
  const { type, payload } = req.body;

  // I WILL JUST CONSOLE LOG STUFF FOR NOW
  console.log({ type, payload });

  // BECAUSE POST SERVICE ALREDY KNOWS THAT POST IS CREATED
  if (type === "PostCreated") {
    return res.end();
  }
});

// ---------------------------------

app.get("/posts", (req, res) => {
  res.status(200).send(posts);
});

app.post("/posts", async (req, res) => {
  const { title } = req.body;
  const id = randomBytes(4).toString("hex");
  posts[id] = { id, title };

  try {
    const response = await axios.post("http://localhost:4005/events", {
      type: "PostCreated",
      payload: posts[id],
    });
  } catch (err) {
    console.error("Something went wrong", err);
    res.end();
  }

  res.status(201).send(posts[id]);
});

const port = 4000;

app.listen(port, () => {
  console.log(`listening on: http://localhost:${port}`);
});

```

I JUST CONSOLE LOGED STUFF FOR NOW

## ANTICIPATING NOTIFICATIONS INSIDE COMMENTS SERVICE

- `code comments/index.js`

```js
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

// ADDING /events HANDLER

app.post("/events", async (req, res) => {
  const { type, payload } = req.body;

  // I WILL JUST CONSOLE LOG STUFF FOR NOW
  console.log({ type, payload });

  // BECAUSE COMMENT SERVICE ALREDY KNOWS THAT COMMENT IS CREATED
  if (type === "CommentCreated") {
    return res.end();
  }
});

// -----------------------------

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

```

SAME THING HERE I JUST CONSOLE LOG STUFF FOR NOW

THAT'S BECAUSE I WANT TO TEST THS BEFORE I CONTINUE

## MY EVENT BUS HAVE MISTAKES, AND I THINK THAT MISTAKE IS IN USING MUTLIPLE `try catch` BLOCKS

I'LL TRY TO CORRECT THAT BY USING `Promise`

## TESTING ALL /events ROUTES

- `yarn start`

- `cd posts/` `yarn start`

- `cd comments/` `yarn start`

- `cd event_bus/` `yarn start`

NOW TRY TO CREATE POST AND LOOK AT TERMINAL TERMINALS OF POSTS AND COMMENTS SERVICES

SAME THING FOR CREATING COMMENT

# MY EVENT BUS
