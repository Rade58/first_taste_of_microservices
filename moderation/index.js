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
