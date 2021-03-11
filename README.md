# HANDLING NOTIFICATIONS

I MADE A SCAFOLD FOR QUERY SERVICE IN PREVIOUS BRANCH

NOW I NEDD TO HANDLE EVENTS SENT FROM THE BUS, INSIDE MENTIONED SERVICE

YOU CAN CALL THEM EVENTS; BUT **ANYTHING SENT FROM EVENT BUS I LIKE CALLING "NOTIFICATIONS"**

- `code query/index.js`

```js
const express = require("express");
const cors = require("cors");
const { json } = require("body-parser");

const app = express();

app.use(cors());
app.use(json());

// FIRS LETS ADD DATA STRUCTURE FOR STORING STUFF
// A FAKE DATABASE, BECAUSE I AM DOING THINGS IN MEMORY
// FOR THIS PROJECT (I DON'T HAVE DATABASE)
const posts = {
  // THIS IS DICTIONARY
  // AND ONE DOCUMENT WOULD LOOK LIKE THIS
  /* "placeholder post Id": {
    id: "same post id",
    title: "posts title",
    comments: [
      // comments associated with one post
      { id: "comment id", content: "stuff", postId: "you know" },
    ],
  }, */
};

app.get("/posts", async (req, res) => {
  // -
});

// LETS HANDLE EVENTS (NOTIFICATIONS FROM THE BUS)
app.post("/events", async (req, res) => {
  const { type, payload } = req.body;

  // NOW I AM HANDLING STORING

  if (type === "PostCreated") {
    posts[payload.id] = { ...payload, comments: [] };
  }

  if (type === "CommentCreated") {
    const postId = payload.postId;

    posts[postId]["comments"].push({
      id: payload.id,
      content: payload.content,
      postId,
    });
  }

  // SENDING EMPTY OBJECT BECAUSE BUS DOESN'T NEED ANYTHING BACK
  res.send({});
});

const port = 4002;

app.listen(port, () => {
  console.log(`Query Service on: http://localhost:${port}`);
});
```



