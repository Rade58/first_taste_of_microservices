# HOW TO COMMUNICATE BETWEEB SERVICES

TI SI PODESIO ClusterIP SERVICES ZA PODOVE IZ DVA DEPLOTMENT-A

DAKLE IMAS TAKVA DVA CLUSTER IP SERVICE-A KAO COMMUNICATION LAYERE ISPRED POD-OVA

REKAO SAM TI DA SE SDA SA POMENUTI MSERVISIMA KOJI SE RUNN-UJU MORATI PRAVITI REQUEST PREMA CLUSTER IP SERVISIMA

ZASTO?

PA NISU TI SVI MICROSERVISI DEPLOYED NA ISTOJ VIRTUAL MACHHINI ILI ISTOJ MACHINE-I

RANIJE JE TAKO BILO, JER NISI KORISTIO KUBERNETES, I NISI NISTA DOCKERIZOVAO

# DA SE PODESTIM KAKO RADI MOJ PROJKAT

PA IMAM MICROSERVICES T=STRUKTURU KOJA JE EVENT BASED

IMAM EVENT BUS, I KADA CLIENT HITT-UJE JEDAN MICROSRVIS, ONDA SE SALJE EVENT IZ TOG SERVISA PREMA EVENT BUS-U, E ONDA EVENT BUS SALJE NOTIFIKACIJE SVIM MICROSERVISIMA KOJE IMAM

# ALI SADA POSTO SVE NIJE NA ISTOJ VIRTUAL MACHINE-I IMAM POGRESNE URL-OVE, JEDAN JE AGAINST WHICH MICROSERVICE SENDS EVENT, A DRUGI SU ONI AGAINST WHICH EVENT BUS SALJE NOTIFICATION-E

EVO POGLEDDAJ

- `cat posts/index.js`

```js
const express = require("express");
const { json, urlencoded } = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const { default: axios } = require("axios");

const app = express();

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

const posts = { someid: { id: "someid", title: "foo bar baz" } };

app.post("/events", async (req, res) => {
  const { type, payload } = req.body;

  console.log({ type, payload });

  res.send({});
});

app.get("/posts", (req, res) => {
  res.status(200).send(posts);
});

app.post("/posts", async (req, res) => {
  const { title } = req.body;
  const id = randomBytes(4).toString("hex");
  posts[id] = { id, title };

  try {

    // EVO OVO JE PROBLEM
    //  OVAJ URL NE FUNKCIONISE AKO ZNAM DA JE EVENT BUS
    // USTVARO CONTAINERIZOVAN INSIDE POD
    const response = await axios.post("http://localhost:4005/events", {
      type: "PostCreated",
      payload: posts[id],
    });
  } catch (err) {
    console.error("Something went wrong", err);
    res.end();
  }

  res.status(201).send(posts[id]);
});

const port = 4000;

app.listen(port, () => {
  // EVO SADA SAM OPET PROMENIO STA CE SE OVDE STAMPATI
  console.log("v108"); // PROMENIO SAM OVO DA JE OVO VERZIJA 108 (RANIJE JE KAO STAJALO 46)
  //

  console.log(`listening on: http://localhost:${port}`);
});

```

- `cat event_bus/index.js`

```js
const express = require("express");
const axios = require("axios");
const { json, urlencoded } = require("body-parser");
const cors = require("cors");

const app = express();

const events = [];

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

app.post("/events", (req, res) => {
  const event = req.body;

  events.push(event);

  // EVO OVO NE VALJA ATO STO, OPET NAPOMINJEM
  // MICROSERVISI AGAINST WHICH I'M MAKING A REQUEST
  // SU INSIDE THEIR OWN VIRTIAL MACHINES
  // ODNOSNO ONI SU INSIDE PODS, ODNOSNO INSIDE CONTAINERS

  // TACNIJE SAMO JE TAK OSA POSTS
  axios.post("http://localhost:4000/events", event);
  // OSTALI JOS NISAM PROVEO KROZ KUBERNETES WORKFLOW
  // ALI TO PLANIRAM DA URADIM
  axios.post("http://localhost:4001/events", event);
  axios.post("http://localhost:4002/events", event);
  axios.post("http://localhost:4003/events", event);

  res.send({ status: "OK" });
});

app.get("/events", (req, res) => {
  res.send(events);
});

const port = 4005;

app.listen(port, () => {
  console.log(`Event Bus on: http://localhost:${port}`);
});
```
