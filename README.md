# HANDLING GET REQUEST FOR QUERY SERVICE

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
    comments: [
      { id: "comment id", content: "stuff", postId: "you know" },
    ],
  }, */
};

// HANDLING GET FOR /posts
app.get("/posts", async (req, res) => {
  //

  res.send(posts);
});

app.post("/events", async (req, res) => {
  const { type, payload } = req.body;

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

  res.send({});
});

const port = 4002;

app.listen(port, () => {
  console.log(`Query Service on: http://localhost:${port}`);
});

```

LIKE YOU SAW, I SENDING WHOLE POSTS, EVERY DOCUMENT

# TIME TO MANUALY TEST EVERYTHING

YOU'LL HAVE MANY TERMINALS

- `yarn start`

NEW TERMINAL

- `cd /event_bus` `yarn start`

NEW TERMINAL

- `cd /posts` `yarn start`

NEW TERMINAL

- `cd /comments` `yarn start`

NEW TERMINAL

- `cd /query` `yarn start`

**OK, NOW OPEN REACT APP AND MAKE A FEW POSTS, THEN RELOAD, ADD A FEW COMMENTS FOR EVRY POST YOU CREATED; YOU DON'T NEED TO RELAOAD ANYMORE**

**NOW TRY HITTING QUERY SERVICE WITH A GET FOR /posts ROUTE** (YOU CAN USE `httpie`)

NEW TERMINAL

- `http GET :4002/posts`

WHEN I EXECUTED ABOVE I GOT ALL THE POSTS

LIKE YOU CAN SEE HERE

```json
TTP/1.1 200 OK
Access-Control-Allow-Origin: *
Connection: keep-alive
Content-Length: 950
Content-Type: application/json; charset=utf-8
Date: Thu, 11 Mar 2021 11:03:57 GMT
ETag: W/"3b6-5nMFInjhTgG/pwO1w0B9iCGaaXg"
Keep-Alive: timeout=5
X-Powered-By: Express

{
    "5b09a2d4": {
        "comments": [
            {
                "content": "you are you",
                "id": "72bab869",
                "postId": "5b09a2d4"
            },
            {
                "content": "HELLO",
                "id": "c7612660",
                "postId": "5b09a2d4"
            },
            {
                "content": "ARE YOU OK",
                "id": "192ac8ab",
                "postId": "5b09a2d4"
            }
        ],
        "id": "5b09a2d4",
        "title": "Alibaba Hello"
    },
    "92098551": {
        "comments": [
            {
                "content": "Hi hello",
                "id": "d4088d6a",
                "postId": "92098551"
            },
            {
                "content": "looking alright",
                "id": "b0f48c4c",
                "postId": "92098551"
            }
        ],
        "id": "92098551",
        "title": "Stavros Halkias Biz"
    },
    "b6aac836": {
        "comments": [
            {
                "content": "HELLO",
                "id": "21e736af",
                "postId": "b6aac836"
            },
            {
                "content": "YOU ARE YOUHOOOHOO",
                "id": "4ba47ce2",
                "postId": "b6aac836"
            },
            {
                "content": "MY FRIEND JEFF",
                "id": "73490fff",
                "postId": "b6aac836"
            }
        ],
        "id": "b6aac836",
        "title": "Emanuelle"
    },
    "cf1cdd4d": {
        "comments": [
            {
                "content": "mERKE MERKEL",
                "id": "43db1082",
                "postId": "cf1cdd4d"
            },
            {
                "content": "helloohooo",
                "id": "5a58a253",
                "postId": "cf1cdd4d"
            },
            {
                "content": "My Name is jeff bez",
                "id": "75c7a7c9",
                "postId": "cf1cdd4d"
            }
        ],
        "id": "cf1cdd4d",
        "title": "My Angel"
    }
}



```







