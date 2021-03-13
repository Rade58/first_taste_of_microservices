# SERVICE USING STORED EVENTS

WE DID DEFINED STORING OF EVENTS AND ALSO WE HAVE ANDPOINT THAT SERVES THEM

WE WILL NOW IMPLEMENT FETCHING THOSE EVENT INSIDE SERVICE, WHO WAS POSSIBLY DOWN AND IS RESTARTING

LETS DO THAT FOR OUR QUERY SERVICE

- `code query/index.js`

```js
const express = require("express");
const cors = require("cors");
const { json } = require("body-parser");
const { default: axios } = require("axios");

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
  console.log({ posts });
  res.send(posts);
});

// I ADDED THIS HELPER WHEN I WAS DEBUGGING
// IT IS OBVIOUS WHT IT'S DOING
//  BUT THAT IS NOT THE MOST IMPORTAN THING
// IMPORTANT THING I PLACED IN CALLBACK THAT EXECUTES WHEN SERVER START
// AT TH EED OF THIS FILE
// YES I WILL USE THIS FUNCTION BACK THERE TOO
// BECAAUSE AS YOU EE IT PROVIDES SOME AUTOMATION OF STORING
// BASED ON EVENT TYPE
// JUST WHAT I NEED
const handleEvent = (type, payload) => {
  if (type === "PostCreated") {
    const { id, title } = payload;

    posts[id] = { id, title, comments: [] };
  }

  if (type === "CommentCreated") {
    const { id, postId, content, status } = payload;

    posts[postId].comments.push({ id, content, status });
  }

  if (type === "CommentUpdated") {
    const { id, postId, status, content } = payload;

    console.log({ status });

    const comments = posts[postId].comments;

    const comment = comments.find((val, index) => {
      return val.id === id;
    });

    comment.status = status;
    comment.content = content;
  }
};

// ------------------------------------------------

app.post("/events", async (req, res) => {
  const { type, payload } = req.body;

  handleEvent(type, payload);

  res.send({});
});

const port = 4002;

// IN HERE
app.listen(port, async () => {
  // SO WE ARE GOING TO UPDATE THIS DTABASE OF QUERY SERVICE
  // WITH ALL EVENTS THAT WERE STACKED WHEN THIS SERVICE WAS DOWN

  const response = await axios.get("http://localhost:4005/events");

  const events = response.data;

  events.forEach((event) => {
    const { type, payload } = event;

    handleEvent(type, payload);
  });

  console.log(`Query Service on: http://localhost:${port}`);
});

```

# NOW WE CAN TEST, BY STARTING ALL SERVICES, BUT NOT QUERY SERVICE

NEW TERMINAL

`yarn start`

NEW TERMINAL

`cd posts` `yarn start`

NEW TERMINAL

`cd comments` `yarn start`

NEW TERMINAL

`cd moderation` `yarn start`

NEW TERMINAL

`cd event_bus` `yarn start`

**WE ARE NOT DOING THIS:** `cd query` `yarn start` **FOR NOW, BECAUSE WE WILL START THIS SERVICE LATER**

YOU SHOULD MAKE FEW POSTS BY INTERACTING WITH REACT APP

EVEN YO UCREATED POSTS, WHEN YOU RELAOD THE PAGE, YOUR POSTS WON'T BE DISPLAYED, SINCE QUERY SERVICE, RESPONISBLE FOR SERVING THOSE POSTS ISN'T OPERATIONAL

WHEN YOU START QUERY SERVICE

- `cd query` `yarn start`

AND WHEN YOU RELAOD THE PAGE, YOU SHOULD SEE POSTS

