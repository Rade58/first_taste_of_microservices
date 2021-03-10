# CREATING DATA QUERY SERVICE

- `mkdir query`

- `cd query`

- `yarn init -y`

- `yarn add express cors nodemon`

- `code package.json`

```json
"scripts":
    "start": "npx nodemon index.js"
```

- `touch index.js`

```js
const express = require("express");
const cors = require("cors");
const { json } = require("body-parser");

const app = express();

app.use(cors());
app.use(json());

// DEFINE GET (FOR ALL POSTS TOGETHER WITH COMMENTS)
app.get("/posts", async (req, res) => {
  // I'LL LEAVE THIS EMPTY FOR NOW
});

// SO THIS IS GOING TO BE A HANDLER FOR ANTICAPATING
// EVERY EVENT SENT BY EVENT BUS
app.post("/posts", async (req, res) => {
  // I'LL LEAVE THIS EMPTY FOR NOW
});

const port = 4002;

app.listen(port, () => {
  console.log(`Query Service on: http://localhost:${port}`);
});

```

FOR NOW, YOU CAN JUST TEST IT IF IT WORKS

- `cd query`

- `yarn start`

SERVER WORKS, IT IS UP AND RUNNING






