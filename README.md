# BUILDING DEPLOYMENTS FOR THE REST OF THE MICROSERVICES; BUILDING CLUSTER ID SERVICES FOR THE REST OF MICROSERVICES

***

REC JE O `query` `moderation` `comments`

***

**NARAVNO PRVO MORAM REBUILD-OVATI IMAGES**

**ZATO STO CU USTVARI U CODEBASE-U MENJATI ONE URL-OVE INSIDE, JER HIT-UJE EVENT BUS MICROSERVICE KAO DA SU SVI U ISTOJ VIRTUAL MACHINE-I** (STO MI NE ODGOVARA, JER KADA BUDEM KREIRO DEPLOYMENTS I CLUSTER IP SERVISE SVI MICROSERVICE-I CE IMATI SVOJE PODS, ODNOSN OSVOJE VIRTUEL MACHINE)

A ZNAS DA EVENT BUS VEC IMA SVOJ POD, ODNOSNOSNO DEPLOYMENT I SVOJ CLUSTER IP SERVICE

- `k get services`

```zsh
NAME            TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
event-bus-srv   ClusterIP   10.103.22.50    <none>        4005/TCP         4h5m
kubernetes      ClusterIP   10.96.0.1       <none>        443/TCP          2d9h
posts-dev-srv   NodePort    10.105.170.31   <none>        4000:31690/TCP   3h47m
posts-srv       ClusterIP   10.105.230.95   <none>        4000/TCP         7h6m
```

DAKLE PONOVO CU DA KAZEM KOJI JE TO URL SAGRADJEN OD NJEGOVOG CLUSTER IP SERVICE-A PLUS PORT PLUS EXPRESS ENDPOINT

GOVORIM O URL-U ZA SLANJE EVENT-OVA PREMA EVENT BUS-U

TO JE

`http://event-bus-srv:4005/events`

## 1. EDIT-UJEM DAKLE PRVO CODEBASE

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
  /* "post id": {
    id: "post id",

    comments: [
      {
        id: "",
        content: "",
        status: "pending",
      },
    ],
  }, */
};

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

  const commentId = randomBytes(4).toString("hex");

  const startingStatus = "pending";

  const comments = commentsByPostId[postId] || [];

  comments.push({ id: commentId, content, status: startingStatus });

  commentsByPostId[postId] = comments;

  // UMESTO OVOGA
  // await axios.post("http://localhost:4005/events", {
  // OVO
  await axios.post("http://event-bus-srv:4005/events", {
    type: "CommentCreated",
    payload: {
      postId,
      id: commentId,
      content,
      status: startingStatus,
    },
  });
  return res
    .status(201)
    .send({ id: commentId, content, status: startingStatus });
});

app.post("/events", async (req, res) => {
  const { type, payload } = req.body;

  if (type === "CommentModerated") {
    const { postId, status: newStatus, content, id } = payload;
    console.log({ newStatus });

    const comment = commentsByPostId[postId].find((val, index) => {
      return val.id === id;
    });

    comment.status = newStatus;

    // UMESTO OVOGA
    // await axios.post("http://localhost:4005/events", {
    // OVO
    await axios.post("hhttp://event-bus-srv:4005/events", {
      type: "CommentUpdated",
      payload: {
        id,
        postId,
        content,
        status: newStatus,
      },
    });
  }

  return res.send({});
});

const port = 4001;

app.listen(port, () => {
  console.log(`Comments service on: http://localhost:${port}`);
});

```

- `code moderation/index.js`

```js
const express = require("express");
const axios = require("axios");
const { json } = require("body-parser");

const app = express();

app.use(json());

app.post("/events", async (req, res) => {
  const { type, payload } = req.body;

  if (type === "CommentCreated") {
    const { content, id, postId } = payload;

    const forbidden = ["foobar"];

    console.log({ content });

    const newStatus = content.includes(forbidden[0]) ? "rejected" : "approved";

    console.log({ newStatus });

    // UMESTO OVOGA
    // await axios.post("http://localhost:4005/events", {
    // OVO
    await axios.post("http://event-bus-srv:4005/events", {
      type: "CommentModerated",
      payload: {
        id,
        content,
        status: newStatus,
        postId,
      },
    });
  }
  return res.send({});
});

const port = 4003;
app.listen(port, () => {
  console.log(`moderation service on: http://localhost:${port}`);
});
```

- `code query/index.js`

```js
const express = require("express");
const cors = require("cors");
const { json } = require("body-parser");
const axios = require("axios");

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

app.post("/events", async (req, res) => {
  const { type, payload } = req.body;

  handleEvent(type, payload);

  res.send({});
});

const port = 4002;

app.listen(port, async () => {
  // UMESTO OVOGA
  //const reponse =  await axios.get("http://localhost:4005/events");
  // OVO
  const response = await axios.get("http://event-bus-srv:4005/events");

  const events = response.data;

  events.forEach((event) => {
    const { type, payload } = event;

    handleEvent(type, payload);
  });

  console.log(`Query Service on: http://localhost:${port}`);
});
```
