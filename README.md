# HANDLING "CommentModerated" EVENT ISIDE COMMENTS SERVICE; AND HANDLING "CoommentUpdated" INSIDE QUERY AERVICES

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
    // WE WILL FIRST STORE MODERATED COMMENT

    // BUT WE NEED TO FILTER (MAYBE THIS IS USELESS)
    commentsByPostId[postId]["comments"].filter((comment) => {
      if (comment.id !== id) {
        return comment;
      } else {
        return { ...comment, status };
      }
    });

    // THEN WE ARE SENDING "CommentUpdated" TO EVENT BUS

    await axios.post("http://localhost:4005/events", {
      type: "CommentUpdated",
      payload: {
        id,
        postId,
        content,
        status,
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
```

NOW WE NEED TO HANDLE "CommentUpdted" INSIDE QUERY SERVICE

- `code query/index.js`

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
    // WE WILL FIRST STORE MODERATED COMMENT

    // THIS MIGHT BE USELESS SINCE WE ARE NEVER HITTING DATABASE
    // OF COMMENTS SERVICE, BUT I'LL LEAVE THIS SINCE
    // I AM GOING TO DO SAME THING IN A QUERY SERVICE
    const comment = commentsByPostId[postId]["comments"].find((val, index) => {
      if (val.postId === postId) {
        // i = index;
        return true;
      } else {
        return false;
      }
    });

    comment.status = status;

    // ------------------

    // THEN WE ARE SENDING "CommentUpdated" TO EVENT BUS

    await axios.post("http://localhost:4005/events", {
      type: "CommentUpdated",
      payload: {
        id,
        postId,
        content,
        status,
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

```

# WE CAN TEST THIS NOW

NOT THROUGH REACT APP (IN A SENSE THAT WE ARE NOT RENDERING ANYTHING BASED ON status)

BUT WE CAN START ALL SERVICES AND START A REACT APP AND THEN WE CAN MAKE FEW POST AND COMMENTS

**AND THEN WE CAN EXECUTE MANUAL TEST BY SENDING REQUEST WITH `httpie` TO QUERY SERVICE**

- `yarn start`

NEW TERMINAL

- `cd posts` `yarn start`

NEW TERMINAL

- `cd comments` `yarn start`

NEW TERMINAL

- `cd query` `yarn start`

NEW TERMINAL

- `cd moderation` `yarn start`

NEW TERMINAL

- `cd event_bus` `yarn start`

I MADE SOME POSTS AND COMMENTS (**IMPORTANT THING IS THAT SOME OF THE COMMENTS SHOUD HAVE WORDS "`foobar`" AND "`bazmod`"**)

**GETTING ALL POSTS WITH httpie**

- `http GET :4002/posts`
