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
  if (type === "CommentCreation") {
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
