const express = require("express");
const axios = require("axios");
const { json, urlencoded } = require("body-parser");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

// -------- I WILL ADD THIS

const sendNotification = async (url, event) => {
  /* try { */
  /* const response =  */ await axios.post(url, event);

  /*   return response;
  } catch (error) {
    console.log(error);
    return "Error";
  } */
};

// ---------------------------------------------

app.post("/events", async (req, res) => {
  const event = req.body;

  // INSTEAD OF MULTIPLE try catch BLOCKS I AM USING
  // Promise.all

  // await Promise.all([
  sendNotification("http://localhost:4000/events", event);
  sendNotification("http://localhost:4001/events", event);
  sendNotification("http://localhost:4002/events", event);
  sendNotification("http://localhost:4003/events", event);
  /* ]).catch((error) => {
    console.log(error);
  }); */

  res.send({ status: "OK" });
});

const port = 4005;

app.listen(port, () => {
  console.log(`Event Bus on: http://localhost:${port}`);
});
