# PREFERRED WAY OF UPDATING DEPLOYMENT

***
***

PRE NEGO STO BUDES RADIO SVE OVO ,NAJBOLJE BI BILO DA CLEAN-UJES THINGS AROUND, JER VEC IMAM NEKOLIKO IMAGE-OVA, KOJI POCINJU SA `radebajic/posts` I IMAJU PRIDODATU VERZIJU, A MOZDA I NEMAJU

- `docker images`

I SVE IMAGE-OVE, KOJI IMAJU TAG KAKAV SAM TI REKAO UKLANJAM SA

- `docker rmi <image id> <image id>` (MOGU UKLONITI VISE ODJEDNOM)

POCECU FRESH TAKO STO CU UNISTITI I DEPLOYMENT

- `k get deployments`

- `k delete deployment posts-depl`

**RADIM SVE OVO U SUSTINI JER E SECAM DA SU MI SE DSILO TO DA SE KORISTE POGRESNE STVARI I DA ZELJENI CHANG-OVI NEKAD NISU DONSILLI NIKAKV EFEKAT, JER SE CHANGE USTVARI APPLY-OVAO NA NESTO POTPUNO DRUGO**

***
***

U PROSLOM BRANCHU POKAZAO SAM NACIN UPDATINGA, PRI KOJEM SE MORA SPECIFICIRATI NOVI IMAGE INSIDE DEPLOYMENT CONFIG-A (YAML FILE-A)

ODNOSNO ZELIM DA IZBEGNEM DA MORAM MANELNO DA EDITUJEM TAJ FILE, KAKO BI SPECIFICIRAO DRUGU VERZIJU IMAGE-A, JER MOZE A SE DESI TYPO ILI DA SE UNESE POGRESAN VERSION NUMBER

**ZELIM NACIN PO KOJEM NE MORAM DA SPECIFICIRAM VERSION UOPSTE U POMENUTOM FILE-U**

# OVAJ NACIN UPDATING-A DEPLOYMENTA UPOTREBLJAVA DOCKER HUB, I ISTO TKO, UMESTO VERZIJE SE SPECIFICIRA `latest` VERZIJA

SASTOJI SE OD SLEDECIH KORAKA

1. EDITOVATI DEPLOYMENT CONFIG FILE, I TU U POD SPEC-U DEFINISATI DA IMAGE IMA `latest` VERZIJU, ILI DA NE DEFINISES VERZIJU, CIME CE PODRAZUMEVATI DA JE TO `latest`
   
SAGRADITI TAKAV DEPLOYMENT SA `kubectl apply -f`

2. ONADA MOZES MODIFIKOVATI TVOJ CODE, TVOJ CODEBASE, DAKLE TO MOZES UPDATE-OVATI (JA DODUSE U PROJEKTU SAMO TO RADIM SA index.js FAJLOM)

3. SAGRADI DOCKER IMAGE, NE SPECIFICIRAJUCI VERZIJU, I IMPLICITNO CE SE KAO VERZIJA PRIHVATITI `latest`

4. PUSH-UJ IMAGE DO DOCKER HUB-A (NE ZABORAVI DA ODRADIS `docker login` KOMANDU)

TO SE RADI POKRETANJEM KOMANDE `docker push`

- `docker push <ime koje se sastoji od tvog dockerhub id pa kroz ime image-a>`

***
***

ZBOG TOGA SIGURNO NECU VISE MORATI DA GURAM DOCKER IMAGE U MINICUBE CACHE NA MOM RACUNARU (STO ZNACI DA OVOG PUT NE KORISTIM `minikube cache add` ILI `minikube image load`)

***
***

5. I MORA SE RUNN-OVATI POSEBNA KOMANDA, KOJOM CE SE NA KRAJU IZVRSITI UPDATING DEPLOYMENTA 

- `kubectl rollout restart deployment <ime deployment-a>`

NARAVNO IME MOZES OTKRITI (AKO SI GA ZABORAVIO NARAVNO), KORISCENJEM `k get deployments`

# SADA CU DA ISPROBAM SVE OVE KORAKE

**MENJAM IMAGE, KAKO NE BI IMAO VERZIJU SPECIFICIRANU ZA IAMGE KOJIM CE SE PRAVITI POD**

- `code infra/k8s/posts-depl.yaml`

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
          image: radebajic/posts

```

KAO STO VIDIS GORE, ZISTA image VISE NEMA SPECIFIED VERSION

MOGU DA BUILD-UJEM OVAJ DEPLOYMENT

- `cd infra/k8s`

- `k apply -f posts-depl.yaml`

**MENJAM SADA MOJ CODE, ODNONO KAO JA SADA NESTO UPDATE-UJEM MOJ CODEBASE, EDITUJEM FILE**

- `code posts/index.js`

USTVARI SAMO CU PROMENITI ONAJ STRING KOJI SAM STMAPAO U CALLBACK-U

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
  // IZMENIO SAM CONSOLE LOG, KAO DA JE DRUGA VERZIJE
  console.log("v46"); // PROMENIO SAM OVO DA JE OVO VERZIJA 16 (RANIJE JE KAO STAJALO 8)
  //

  console.log(`listening on: http://localhost:${port}`);
});

```

**MOGU SAGRADITI DOCKER IMAGE**

- `cd posts`

- `docker build -t radebajic/posts .`

```zsh
Sending build context to Docker daemon  56.83kB
Step 1/6 : FROM node:lts-alpine3.12
 ---> 8f86419010df
Step 2/6 : WORKDIR /app
 ---> Using cache
 ---> aff0e0561350
Step 3/6 : COPY ./package.json ./
 ---> Using cache
 ---> 37437ca61ccc
Step 4/6 : RUN npm install
 ---> Using cache
 ---> 20382b18ae81
Step 5/6 : COPY ./ ./
 ---> 99b4b376042b
Step 6/6 : CMD ["npm", "start"]
 ---> Running in bfc4fb619949
Removing intermediate container bfc4fb619949
 ---> d798c2a9113b
Successfully built d798c2a9113b
Successfully tagged radebajic/posts:latest
```

IMAGE JE SAGRADJEN

- `docker images`

```zsh
REPOSITORY                    TAG              IMAGE ID       CREATED         SIZE
radebajic/posts               latest           18c3cff469b6   2 minutes ago   125MB
radebajic/posts               0.0.8            4f4748b6edc8   2 hours ago     125MB
radebajic/posts               0.0.1            8d6f9ce5d76b   2 days ago      125MB
node                          lts-alpine3.12   8f86419010df   8 days ago      117MB
gcr.io/k8s-minikube/kicbase   v0.0.18          a776c544501a   3 weeks ago     1.08GB
```

**E SADA PUSH-UJEM IMAGE U [DOCKER HUB](https://hub.docker.com/)**

JA SAM VEC NAPRAVIO NALOG NA DOCKER HUB-U, I MOZES SE LOG-OVATI KROZ COMMAND LINE GDE CES BITI PROMPTED DA UNESES SIFRU I TVOJ DOCKER ID

MOJ DOCKER ID JE `radebajic`

- `docker login` (MISLIM D OVO TREBA DA BI UOPSTE MOGAO DA PUSH-UJES)

- `docker push radebajic/posts`

```zsh
Using default tag: latest
The push refers to repository [docker.io/radebajic/posts]
c8637148601e: Pushed 
c1c394a7dbc3: Pushed 
15c53badf04e: Pushed 
5e4d92dc56e9: Pushed 
a8e8c71490ec: Mounted from library/node 
ea79b9f37866: Mounted from library/node 
62a7f5bbacbd: Mounted from library/node 
33e8713114f8: Mounted from library/node 
latest: digest: 
size: 1992
```

OTISAO SAM NA MOJ NALOG DOCKER HUB-A I ZISTA JE TAJ IMAGE SADA TAMO

**I SADA USTVARI JA RUNN-UJEM `kubectl rollout restart deployment` KOMANDU**

ALI PRVO DA UZEM DEPLOYMENT TAG

- `k get deployments`

```zsh
NAME         READY   UP-TO-DATE   AVAILABLE   AGE
posts-depl   1/1     1            1           5h1m
```

- `k rollout restart deployment posts-depl`

```zsh
deployment.apps/posts-depl restarted
```

DA SADA VIDIM LOGS POD-A, DA VIDIM DA LI SU SE PROMENE UOPSTE APPLY-OVALE

- `k get deployments`

```zsh
NAME         READY   UP-TO-DATE   AVAILABLE   AGE
posts-depl   1/1     1            1           5h19m
```

- `k get pods`

```zshh
NAME                          READY   STATUS    RESTARTS   AGE
posts-depl-57f6cf45fb-smssq   1/1     Running   0          55s
```

- `k logs posts-depl-57f6cf45fb-smssq`

```zsh
> posts@1.0.0 start /app
> npx nodemon index.js

[nodemon] 2.0.7
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node index.js`
v46
listening on: http://localhost:4000

```

VIDIM v46 DAKLE USPENO SU SE SVE PROMENE PPLY-OVALE

# TI SADA VISE NE MORAS DA MENJAS I DA EDITUJES DEPLOYMENT CONFIG FILE

DAKLE TO SAM RADIO SAMO JEDNOM, KAKO BI PODESIO RIGHT IMAGE, ODNOSNO DA NEMA VRZIJE ZA IMAGE OD KOJEG PRAVI POD (ILI DA TA VERZIJA BUDE SPECIFIED SA `latest`)




