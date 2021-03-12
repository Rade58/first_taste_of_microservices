# CREATING MODERATION SERVICE

- `mkdir moderation`

- `cd moderation`

- `yarn init -y`

- `code package.json`

```json
"scripts":
    "start": "npx nodemon index.js"
```

- `yarn add express nodemon axios`

***
***

**YOU DON'T NEED `cors` BECAUSE THIS SERVICE SN'T GOING TO COMMUNICATE DIRACTLY WITH FRONTEND**

***
***

- `touch index.js`

```js
const express = require("express");
const axios = require("axios");
const { json } = require("body-parser");

const app = express();

app.use(json());

// ANTICIPATING ECHO FROM EVENT BUS
app.post("/events", async (req, res) => {
  const { type, payload } = req.body;

  // TYPE WE ARE ANTICIPATING IS COMMENT CREATION
  if (type === "CommentCreated") {
    // IN HERE I WILL DO MODERATION
    // AFTER WE ARE DONE WITH MODERATION
    // WE SHOULD EMMIT "CommentModerated"
    // WITH AXIOS
    // AND "CommentModerated" WILL BE ANTICIPATED BY COMMENTS
    // SERVICE
    // I WILL MAKE A PUSE BEFORE DOING ALL THIS
  }
});

const port = 4003;
app.listen(port, () => {
  console.log(`moderation service on: http://localhost:${port}`);
});

```

OK, AS YOU SEE ABOVE, WE NEED JUST ONE SINGLE HANDLER, WHICH WE SETTED UP

NOW WEE NEED TO DESTRUCTURE PAYLOAD AND ADD MODERATION LOGIC

AND EMMIT THAT TOGETHER WITH "CommentModerated" EVENT

BEFORE THAT WE WILL TEST THAT THIS SERVICE IS WORKING

- `cd moderation` `yarn start`

IT IS OPERATIONAL

## FIRS WE WILL SET UP THAT EVERY CREATED COMMENT IS IN 'pending' STATUS

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
        // ADDING status HERRE IS MOST IMPORTANT
        // BECAUSE FROM HERE, THAEN THROUGH EVENT BUS, WILL END 
        // UP TO MODERATION SERVICE
        status,
        // IT WILL END UP TO QUERY SERVICE TOO (DON'T FORGET)
        // BECUSE IT IS GOING TO BE ECHOED BCK THERE TOO
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

```

## WE ALSO NEED TO MAKE SURE THAT QUERY ERVICE IS SERVING `status` WITH THE REST OF THE DATA

- `code query/index.js`

```js
const express = require("express");
const cors = require("cors");
const { json } = require("body-parser");

const app = express();

app.use(cors());
app.use(json());

const posts = {
  /* "placeholder post Id": {
    id: "same post id",
    title: "posts title",
    // SO status WILL BE PART OF THE DOCUMENT TOO
    comments: [
      { id: "comment id", content: "stuff", postId: "you know", status: "pending or rejected or approved" },
    ],
  }, */
};

app.get("/posts", async (req, res) => {
  //

  res.send(posts);
});

// HERE WE DESTRUCTURE status TOO (FROM PAYLOAD OFCOURSE)
app.post("/events", async (req, res) => {
  const { type, payload } = req.body;

  if (type === "PostCreated") {
    posts[payload.id] = { ...payload, comments: [] };
  }

  if (type === "CommentCreated") {
    const postId = payload.postId;

    // WE ARE DOING THIS HERE

    posts[postId]["comments"].push({
      id: payload.id,
      content: payload.content,
      postId,
      // HERE YOU GO
      status: payload.status,
    });
  }

  res.send({});
});

const port = 4002;

app.listen(port, () => {
  console.log(`Query Service on: http://localhost:${port}`);
});

```

NOW WE CAN IMPLEMENT MODERATION LOGIC

# COMMENT MODERATION LOGIC

- `code moderation/index.js`

WE WILL SEND "CommentModereted EVENT AND "BASED ON THE content OF THE COMMENT, WE WILL SEND DIFFERENT status INSIDE PAYLOAD

status CAN BE 'approved', 'rejected' OR 'pending'

```js
const express = require("express");
const axios = require("axios");
const { json } = require("body-parser");

const app = express();

app.use(json());

app.post("/events", async (req, res) => {
  const { type, payload } = req.body;

  if (type === "CommentCreated") {
    const { content, id } = payload;

    // YOU CAN USE TRNARY TO DECIDE MODERATION
    const forbidden = ["foobar", "bazmod"];

    const status =
      content.includes(forbidden[0]) || content.includes(forbidden[1])
        ? "rejected"
        : "approved";

    // I CAN NOW SEND "CommentModerated" EVENT TO THE EVENT BUS
    await axios.post("http://localhost:4005/events", {
      type: "CommentModerated",
      payload: {
        id,
        content,
        status,
      },
    });

    return res.send({});
  }

  res.end();
});

const port = 4003;
app.listen(port, () => {
  console.log(`moderation service on: http://localhost:${port}`);
});

```

