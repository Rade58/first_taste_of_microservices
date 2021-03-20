# UPDATING DEPLOYMENTS

REKAO SAM TI JEDNOM RANIJE, DA **MI KORISTIMO DEPLOYMENTS, JER MOZEMO VEOMA LAKO DA UPDATE-UJEM VERSION IMAGE-A ZA, KOJE KORISTE SVAKI OD OUR PODS**

TO ZNACI DA AKO NA PRIMER NAPRAVIS PROMENU U posts PROJEKTU **I REBUILD-UJES IMAGE** (VAZNO JE DA SE REBUILD-UJE (SAMO NAPOMINJEM)) POSLE TOGA, MOZDA CES **ZELETI DA REDEPLOY-OVATI APLIKACIJU KAKO BI SE RUNN-OVALA DRUGA VERZIJU IMAGE-A INSTEAD (USTVARI KAKO BI PODS ILI POD RUNN-OVAAO DRUGU VERZIJU TOG IMAGE (IL IDA SE IZRAZIM TACNIJE, KAKO BI SE CONTAINER/I INSTATICIZIRAO/LI OD NOVE VERZIJE IMAGE-A))**

# POSTOJE DVA NACINA DAA SE UPDATE-UJE IMAGE

JEDAN OD METODA, ZA KOJI CU TI RECI NE KORISTI SE MUCH OFFTEN, ZATO CU TI TO PRVO POKAZATI

# UPDATING DEPLOYMENT METHOD ONE

KORACI SE SASTOJE OD:

1. MAKING-U CHANGE- TO YOUR PROJECT CODE

2. ZATIM REBUILD-UJES DOCKER IMAGE, SA SPECIFICIRANOM NOVOM VERZIJOM IMAGE-A

3. ONDA EDIT-UJES DEPLOYMENT-OV CONFIG YAML FILE, GDE BI SPECIFICIRAO NOVU VERZIJU IMAGE-A

4. I RUNN-OVANJE REBUILD-A DEPLOYMENTA SA KOMANDOM
  `kubectl apply -f <depl config file name>`

***
***

**ISPROBACU SDA OVAJ METOD**

- `code posts/index.js`

SAMO CU UBACITI DODATNO CONSOLE LOG, JER NE ZNAM STA BI DRUGO MENJAO

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
  // EVO OVDE SAM DODAO TAJ CONSOLE LOG
  console.log("v8"); // KAO NAZNAVIO SAM DAJ OVO VERZIJA 8 (BEZVEZE)
  // ZAMILI KAO DA TI INTEND-UJES DA DEPLOY-UJES OSMU VERIJU OVOG SERVISA
  //

  console.log(`listening on: http://localhost:${port}`);
});

```

**REBUILD-OVACU IMAGE, A TADA CU ZADATI I NOVU VERZIJU ZA IMAGE**

ZNAS GDE TI JE DOCKERFILE (TAMO RUNN-UJES KOMANDU)

- `cd posts`

- `docker build -t radebajic/posts:0.0.8 .`

- `docker images`

```zsh
REPOSITORY                    TAG              IMAGE ID       CREATED          SIZE
radebajic/posts               0.0.8            4f4748b6edc8   51 seconds ago   125MB
radebajic/posts               0.0.1            8d6f9ce5d76b   45 hours ago     125MB
node                          lts-alpine3.12   8f86419010df   8 days ago       117MB
gcr.io/k8s-minikube/kicbase   v0.0.18          a776c544501a   3 weeks ago      1.08GB
```

**ONO STO RADIM SADA JESTE DA DODAM TAJ IMAGE U REGISTRY MINIKUBE-A** (RANIJE SAM TO RDIO SAMO SA `minikube cache add`, ALI OVO JE U FAZI DEPRECATION- I ZATO CU KORISTITI `minikube image load`) (MADA MI IZGLEDA DA minikube cache add BRZE RADI ,I DA LOAD NE RADI BAS DOBRO ZATO IPAK KORISTIM PRVU OPCIJU)

- `minikube cache add radebajic/posts:0.0.8`

- `minikube cache list`

```zsh
posts
radebajic/posts:0.0.1
radebajic/posts:0.0.8
```

**SADA MANJEM DEPLOYMNT CONFIG FILE**

SAMO MENJAM VERZIJU IMAGE-A

- `code infra/k8s/posts-depl.yaml`

KAO STO VIDIS UMESTO 1 JA SAM STAVIO 8

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: posts-depl
spec:
  replicas: 1
  selector:
    matchLabels:
      app: posts
  template:
    metadata:
      labels:
        app: posts
    spec:
      containers:
        - name: posts
          image: radebajic/posts:0.0.8
```

**SADA MORAM OPET DA REBUILD-UJEM DEPLOYMENT, SA GORNJIM FILE-OM**

- `cd infra/k8s`

- `k apply -f posts-depl.yaml`

```zsh
deployment.apps/posts-depl configured
```

KUBERNETES ZNA DA LI JE RANIJE BIO NAHRANJEN SA OVIM FILE-OM, ILI JE TO NESTO BRAND NEW

U OVOM SLUCAJU TI SI VEC HRANIO KUBERNETES SA OVIM FILE-OM, JER JE UNUTRA IME `posts-depl`, I ON CE ZNATI DA TREBAA PRAVITI CHANGE U EXISTING OBJECT-U

ZATO TI JE SADA IZASAO MESSAGE DA JE DEPLOYMENT CONFIGURED, A RANIJE KADA SI PRVI PUT OVO RADIO, RECENO JE DA JE CREATED

- `k get deployments`

```zsh
NAME         READY   UP-TO-DATE   AVAILABLE   AGE
posts-depl   1/1     1            1           120m
```

- `k get pods`

```zsh
NAME                          READY   STATUS    RESTARTS   AGE
posts-depl-69657dbfbf-z9d4m   1/1     Running   0          6m18s
```

# DA BI VIDEO DA LI SE CHANGE ZAISTAA APPLY-OVAO, MORACU DA POSEGNEM STAMPANJU LOGOVA IZ POD-A

TO JE ZATO STO SAM CONSOLE LOG STAVIO U ONAJ CALLBACK, KOJI SE IZVRSI NAKON USPOSTAVLJANJA NODE SERVER-A

- `k logs posts-depl-69657dbfbf-z9d4m`

```zsh
> posts@1.0.0 start /app
> npx nodemon index.js

[nodemon] 2.0.7
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node index.js`
v8
listening on: http://localhost:4000

```

**I ZAISTA, ONO v8 JE STAMPANO**

STO ZNACI DA SAM USPESNO UPDATE-OVAO DEPLOYMENT
