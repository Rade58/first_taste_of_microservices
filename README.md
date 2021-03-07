# POST CREATE COMPONENT

WILL BE USING BOOTSTRAP FOR STYLING

WILL LOAD IT FROM CDN

<https://getbootstrap.com/docs/5.0/getting-started/download/#cdn-via-jsdelivr>

LINK TAG WILL BE PLACED IN `public/index.html` HEAD SECTION (**DON'T PASTE SCRIPT TAG**)


## `PostCreate.tsx`

- `touch src/PostCreate.tsx`

```tsx
import React, { FC, useState, useCallback } from "react";
import axios from "axios";

const PostCreate: FC = () => {
  const [title, setTitle] = useState<string>("");

  const submitCallback = useCallback(async () => {
    const createdPost = await axios.post(
      "http://localhost:4000/posts",
      {
        title,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log({ createdPost });
  }, [title]);

  return (
    <div>
      <form
        // INSTEAD OF #  YOU USED e.preventDefault
        // action="#"
        onSubmit={(e) => {
          e.preventDefault();
          submitCallback();
          setTitle("");
        }}
      >
        <div className="form-group">
          <label htmlFor="title-input">Title</label>
          <input
            onChange={(e) => {
              // debugger;
              setTitle(e.target.value);
            }}
            value={title}
            type="text"
            id="title-input"
            className="form-control"
          />
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostCreate;
```

## ALLOWING CORS IN Posts SERVICES (YOU CAN DO THIS FOR Comments SERVICES TOO)

- `cd posts`

- `code index.js`

```js
const express = require("express");
const { json, urlencoded } = require("body-parser");
const { randomBytes } = require("crypto");
// IMPORTED THIS
const cors = require("cors");
//

const app = express();

// ADD CORS
app.use(cors());
//
app.use(json());
app.use(urlencoded({ extended: true }));

const posts = { "placeholder id": "foo bar baz" };

app.get("/posts", (req, res) => {
  res.status(200).send(posts);
});

app.post("/posts", (req, res) => {
  const { title } = req.body;

  const id = randomBytes(4).toString("hex");

  posts[id] = { id, title };

  res.status(201).send(posts[id]);
});

const port = 4000;

app.listen(port, () => {
  console.log(`listening on: http://localhost:${port}`);
});

```

# TESTING

- `yarn start`

- `cd posts` `yarn start`

AND CREATING POSTS BY USING UI

