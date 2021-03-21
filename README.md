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


