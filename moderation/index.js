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
