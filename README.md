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
  
  console.log("v108");

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

# URL-OVE MOZES DA SAGRDIS U POMOC NAME ILI TAGA CLUSTER IP SERVICE-OVA, I PORT-A ZA TAJ CLUSTER IP 

- `k get services` (AKO SI ZABORAVIO k SAM PODESIO DA BUDE ALIAS ZA `kubectl`)

```zsh
NAME            TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
event-bus-srv   ClusterIP   10.103.22.50    <none>        4005/TCP         54m
kubernetes      ClusterIP   10.96.0.1       <none>        443/TCP          2d6h
posts-dev-srv   NodePort    10.105.170.31   <none>        4000:31690/TCP   36m
posts-srv       ClusterIP   10.105.230.95   <none>        4000/TCP         3h55m

```

TAKO DA AKO SALJES REQUEST PREMA posts MIKROSERVISU, ONDA TO RADIS AGAINST SLEDECI ENDPOINT:

- `http://posts-srv:4000`

I TAKO DA AKO SALJES REQUEST PREMA event_bus MIKROSERVISU, ONDA TO RADIS AGAINST SLEDECI ENDPOINT:

- `http://event-bus-srv:4005`

# ZATO TREBA DA UPDATE-UJEM SVE index.js FAJLOVE MOJIH MIKROSERF=VISA, KAKO BI DEFINISAO CORRECT UL-OVE AGAINST AXIOS MAKES REQUESTS

JA CU TO ODRADITI SADA ZA posts MIKROSERVIS I ZA event_bus

TO JE ZATO STO NISAM BUILD-OVAO IMAGE-OVE ZA OSTALE MICROSERVISE, I NISAM NAPRAVIO DEPLOYMENTS ZA NJIH I NISAM NAPRAVIO CLUSTER ID KUBERNETES SERVICE-OVE

ADA OVO RADIS OBOVEZNO CHECK-UJ SPELLING, I OBOVAZNE GLEDAJ DA LI PISES CORRECT PORT U URL-U

A OVA KOMANDA TI SVE TO POMAZE, JER MOZES DA VIDIS SVE SERVICE-OVE

- `k get services`

A SADA DA POCNEM SA REDEFINISANJEM CODE-A

- `code posts/index.js`

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
  // OVO OVDE SAM DAVNO RANIJE DEFINISAO, ALI BICE TI HANDY
  // KADA BUDES TESTIRAO, JER OVDE BI TREBALO DA DODJE EVENT
  // ODNOSNO NOTIFICATION (USTVARI TO JE EVENT, ALI JA ON OSTO 
  // SALJE EVENT BUS ZOVEM NOTIFICATIONOM) 
  console.log({ type, payload });
  // ZATO CE GORNJE STMPANJE BITI HANDY

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
    // UMESTO OVOGA
    // const response = await axios.post("http://localhost:4005/events", {
    //  PISEM OVO (NE ZABORAVI /events)
    const response = axios.post("http://event-bus-srv:4005/events", {
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
  console.log("v108");

  console.log(`listening on: http://localhost:${port}`);
});

```

- `code event_bus/index.js`

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

  // UMESTO OVOGA
  // axios.post("http://localhost:4000/events", event);
  // OVO
  axios.post("http://posts-srv:4000/events", event);
  // OSTALI JOS NISAM PROVEO KROZ KUBERNETES WORKFLOW
  // ALI TO PLANIRAM DA URADIM
  // I ATO COMMENTUJEM OVO OUT ZA SADA
  /* axios.post("http://localhost:4001/events", event);
  axios.post("http://localhost:4002/events", event);
  axios.post("http://localhost:4003/events", event); */

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

# UPDATE-OVO SAM CODEBASE ZA OBA MICROSERVISA, ODNOSNO UPDATE-OVA0 OSAM CODE ZA OBA DEPLOYMENTA, ODNOSNO UPDATE-OVAO SAM CODE ZA SVE PODS KOJE IMAM; ODNOSNO NAJTACNIJE, UPDATE-OVAO SAM IMAGE, PA JE VREM DA REBUILD-UJEM OBA IMAGE-A KOJA IMAM

- `docker images`

```zsh
REPOSITORY                    TAG              IMAGE ID       CREATED        SIZE
radebajic/event_bus           latest           d4bb9439e1e3   4 hours ago    125MB
radebajic/posts               latest           407c80c78664   20 hours ago   125MB
radebajic/posts               <none>           cf42fec26f50   21 hours ago   125MB
radebajic/posts               <none>           db4602a7c143   21 hours ago   125MB
node                          lts-alpine3.12   8f86419010df   9 days ago     117MB
gcr.io/k8s-minikube/kicbase   v0.0.18          a776c544501a   3 weeks ago    1.08GB

```

***
***

digresija:

VIDIM OVDE IMAGE-OVE KOJI NEMAJU `latest` PA SE PITAM DA LI OVO MOZDA MOZE DA IZAZOVE PROBLEM, UKLONICU IH CISTO IZ PREDOSTROZNOSTI

- `docker rmi cf42fec26f50 db4602a7c143`

***
***

DA SE SADA VRATIM NA TEMU

- `docker images`

```zsh
REPOSITORY                    TAG              IMAGE ID       CREATED        SIZE
radebajic/event_bus           latest           d4bb9439e1e3   4 hours ago    125MB
radebajic/posts               latest           407c80c78664   20 hours ago   125MB
node                          lts-alpine3.12   8f86419010df   9 days ago     117MB
gcr.io/k8s-minikube/kicbase   v0.0.18          a776c544501a   3 weeks ago    1.08GB
```

**REBUILD-UJEM IMAGES**

- `cd posts/` `docker build -t radebajic/posts .`

- `cd event_bus` `docker build -t radebajic/event_bus .`

- `docker images` (cisto da vidim da su recreated)


## SADA PUSH-UJEM IMAGES TO EVENT HUB

- `docker push radebajic/posts`
- `docker push radebajic/event_bus`

# I SADA MOGU DA PULL-UJEM IMAGE-OVE AUTOMATSKI SA DOCKER HUB-A U MOJE DEPLOYMENTE, A TAKODJE CE SE U ISTO VREME I DEPLOYMENTI RESTARTOVATI, CIME CE SE U POD-OVIMA KORISTITI NOVI IMAGE-OVE

- `k get deployments`

```zsh
event-bus-depl   1/1     1            1           3h17m
posts-depl       1/1     1            1           20h
```

VEC SAM TI POKAZO KOMANDU ZA TO ,AKO SE SECAS

- `kubectl rollout restart deployment posts-depl`
- `kubectl rollout restart deployment event-bus-depl`

# UVERI SE DA POTPUNO IMAS NOVE PODS, TAKO STO CES VIDETI NJIHOVU STAROST

- `k get pods`

KAKO MOZES DA VIDIS PROSLI SU UNISTENI I DEPLOYMENT JE KREIRAO OVE NOVE

KOJI SU INSTATICIZIRANI SA CHANGEED IMAGE-OVIMA

```zsh
NAME                             READY   STATUS    RESTARTS   AGE
event-bus-depl-697c7f75d-4jgqk   1/1     Running   0          3m20s
posts-depl-7599cdfd64-6rlpv      1/1     Running   0          3m34s
```

# SADA ZELIM DA TESTIRAM MOJ CODE

NAPRAVICU REQUEST PREMA /posts IN ORDER TO MAKE NEW POST

TO SADA MOGU RADITI KROZ ONAJ `NODE PORT SERVICE`, KOJI KAKO SAM RKAO SAMO SLUZI ZA DEVELOPMENT, I OVDE CE UPRAVO DA POSLUZI, I JA MOGU OVDE KORISTITI **HTTPIE** ZA SLANJE POSTS REQUESTA

AKO SE SECAS SALJE S SAMO TITLE ODNOSNO NEKI TEKST

DAKLE ZELI DA WIDIM DA LI CE TAJ FLOW PROCI KAKO TREBA

DAKLE KADA JA NAPRAVIM POST, ONDA POST SERVICE SALJE EVENT PREMA CLUSTER IP SERVISU POD-A, GDE JE DEPLOYED MOJ event_bus MIKROSERVIS

ZATIM TAJ CLUSTER IP REDIRECT-UJE TRAFFIC PREMA EVENT BUS-U

E, A ONDA EVENT BUS SALJE NOTIFICATION SVI SVOJIM OSTALI MIKROSERVISIMA, USTVARI ZA SADA SALJE SAMO DO CLUSTER IP SERVIA, PONOVO ZA posts

E TU CE SE DESITI STMAPNJE JER SAM TAKO DEFINISAO U CODEBASE, I ZNACU DA JE CEO OVAJ FLOW OK

**PRVO DA PRONADJEM ONAJ NODE PORT SERVIS, KOJ IKAKO SAM REKAO SLUZI ZA DEVELOPMENT**

- `k get services`

```zsh
NAME            TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
event-bus-srv   ClusterIP   10.103.22.50    <none>        4005/TCP         3h15m
kubernetes      ClusterIP   10.96.0.1       <none>        443/TCP          2d8h
posts-dev-srv   NodePort    10.105.170.31   <none>        4000:31690/TCP   177m
posts-srv       ClusterIP   10.105.230.95   <none>        4000/TCP         6h16m
```

EVO U PITANJU JE `posts-dev-srv`, CIJI JE PORT `:31690`

TREBA MI JOS IP `minicube`-A

- `minikube ip`

```zsh
192.168.49.2
```

I PRAVIM URL ENDPOINT-A KOJ ISLUZI ZA `'POST'` REQUEST, KOJIM SE PRAVI NOVI POST ZA posts MICROSERVICE

KAO STO VIDIS PRAVIM GA OD MINIKUBE IP-JA, I NODE PORT SERVICE-OVOG PORTA, KAO STO SAM TI RANIJE POKAZO

`192.168.49.2:31690/posts` (posts JE ENDPOINT ZA EXPRESS SERVER, CISTO NAPOMINJEM) (VIDIS DA TI NE TREBA PROTOKOL)

**UPOTREBLJAVAM HTTPIE DA NAPRAVIM POST REQUEST; ISTO TAKO APP MI JE TKAV DA ZAHTEVA `title` PROPERTI U BODY-JU**

- `http POST 192.168.49.2:31690/posts title="Hello I'm Stavros"`

REQUEST JE BIO USPESAN, NE MORAM DA TI POKAZUJEM RESPONSE

**SADA MOGU DA PROVERIM, CEO FLOW, KOJI SAM TI POMNUO VEC**

TO RADIM TAKO STO CU DA STMAPAM LOGS INSIDE POD, KOJI U KOJEM RUNN-UJE CONTAINER IMAGE-A ZA posts MICROSERVICE

- `k get pods`

```zsh
NAME                             READY   STATUS    RESTARTS   AGE
event-bus-depl-697c7f75d-4jgqk   1/1     Running   1          98m
posts-depl-7599cdfd64-6rlpv      1/1     Running   1          98m

```

- `k logs posts-depl-7599cdfd64-6rlpv`

```zsh
> posts@1.0.0 start /app
> npx nodemon index.js

[nodemon] 2.0.7
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node index.js`
v108
listening on: http://localhost:4000
{
  type: 'PostCreated',
  payload: { id: '3c5b7cdc', title: "Hello I'm Stavros" }
}

```

ETO STMAPN JE POST KOJI SAM KRIRAO, TAKO DA JE SVE OK

STO ZNACI DA USPESNO RADI TRAFFIC, PRVO IZMEDJU POD-A I CLUSTER IP SERVISA DRUGOG PODA, I ONDA RADI I TRAFFIC IZMEDJU CLUSTER IP SERVISA I NJEGOVOG POD-A
