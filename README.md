# Ingress CONFIG FILE, MODIFYING CONFIGURATION

***
***

OVO RADIM KKO BI NESTO POPRAVIO, ALI I KAKO BI OMOGUCIO NEKOLIKO STVARI

TAKO DA CU EDIT-OVATI KONFIGURACIJU ZA INGRESS CONTROLLER-A, I TAKODJE CU POKREATITI DOBRO POZNATU `kubectl apply -f`

***
***


# 1. PRVO NE ZELIM DA KORISTIM BETA VERZIJU KONFIGURACIJE ,STO SAM RADIO U PROSLOM BRANCH-U; A PORED TOGA PRIMETIO SAM DA IPAK KORISTIM POGRESAN CLUSTER IP SERVICE FOR GETTING ALL POSTS 

STARA KONFIGURACIJA KORISTI BETA VERZIJU API

TO JE `networking.k8s.io/v1beta1`

A JA ZELLI MDA KORISTIM `networking.k8s.io/v1` (BEZ BETA)

**ALI OVO ZNACI DA SE SINTAKASA RAZLIKUJE**

A NESTO VISE O SINTAKSI [PROCITAO SAM ODVDE](https://kubernetes.io/docs/concepts/services-networking/ingress/)

***
***

OVAKO SAM DEFINISAO SINTAKSU U PROSLOM BRANCH-U

- `cat infra/k8s/ingress-srv.yaml`

```yaml
apiVersion: networking.k8s.io/v1beta1
kind: Ingress
metadata:
  name: ingress-srv
  annotations:
    kubernetes.io/ingress.class: nginx
spec:
  rules:
    - host: myblog.com
      http:
        paths:
          - path: /posts
            backend:
              serviceName: posts-srv
              servicePort: 4000
```

***
***

A EVO PREPRAVIO SAM GORNJU KONFIGURACIJU KAKO BI ONA KORISTILA SINTAKSU NOVE VERZIJE API-A

- `code infra/k8s/ingress-srv.yaml`

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ingress-srv
  annotations:
    kubernetes.io/ingress.class: nginx
spec:
  rules:
    - host: "myblog.com"
      http:
        paths:

          - path: /posts
            pathType: Exact
            backend:
              service:
                name: posts-srv
                port:
                  number: 4000

```

- `cd infra/k8s`

- `kubectl apply -f ingress-srv.yaml`

# DA SE SADA PODSETIM STA USTVARI RADI INGRESS CONTROLLER

ON CE UCINITI DA KADA SALJEM REQUEST NA IP MOG CLUSTERA (TO JE ZA minicube, ZA MC I WINDOWS U PITANJU JE LOCALHOST) DA SE USTVARI ONDA **REQUEST OD GENERATED `LOAD BALANCERA` PROSLEDI DO `INGRESS CONTROLLER-A`** **ONDA DA ROUTING RULES NGINX-A USTVARI ODLUCE KA KOJEM CE SE CLUSTER API SERVICE, ODGOVARAJUCEG POD-A GDE JE JEDNA OD MOJIH NODE MICROSERVICE APLIKACIJE

ODNOSNO ZA SADA SAMO KADA SE SALJE REQUEST PREMA `posts-srv` CLUSTER IP SERVISU, USTVARI REQUEST STIZE DO ODGOVARAJUCE SAME NODE APLIKACIJE

**KAO STO VIDIS, GORE U KONFIGURACIJI, PODESIO SAM I TO DA OVAJ INGRESS CONTROLLER SAMO PRIHVATA REQUESTS SA DOMAIN-A `myblog.com`**

**A JOS VAZNIJA STVAR PODESIO SAM TAKORECI DA KADA SE REQUESTS SALJU NA, `myblog.com`, DA SE ONI USTVARI SALJU DO IP-JA MOG CLISTERA (EXECUTE `minicube ip` TO SEE IP)**

URADIO SAM TO MENJAJUCI hosts NA MOM RACUNARU

`cat /etc/hosts`

```bash
# iznad code me ne zanima, zato ga nisam prikazao

# for my kubernetes firts project
# tricking nginx to believe that minikube ip
# is myblog.com

192.168.49.2 myblog.com
```

***
***

**U SUTINI TI KADA SALJES REQUEST PREMA `myblog.com` USPESNO JE PREVAREN INGRESS CONTROLLER, ILI USPESNO JE PREVAREN VIRTUAL MACHINE, DA IPAK PRIHVATI TAJ REQUEST I PROSLEDI GA RELATED CLUSTE IP SERVISA**

AKO SE PITAS ZASTO SVE OVO POMENUTO, SAMO IZCITAJ PROSLI BRANCH, JER SAM TAM OSVE OBJASNIO U VEZI IMPLEMENTACIJE INGRESS CONTROLLER-A I ZASTO SAM GA UPOTREBIO

I ZASTO, TAKORECI VARAM SA IZMISLJENIM HOSTNAME-OM

MOZDA JE TO U PROSLOM BRANCH-U JASNIJE OBJASNJENO

***
***

# JA TRENUTNO KORISTIM POGRESAN MICROSERVICE ZA GETTING ALL POSTS; ODNONO INGRESS CONTROLLER BI TREBAO DA PROSLEDJUJE REQUEST DO CLUSTER IP SERVISA, KOJI JE IN FRONT OF query MICROSERVICE

A KOD MENE REQUEST ZA GETTING ALL POST ZAVRSI NA KRAJU KOD posts MIKROSERVICE-A

TO CU POPRAVITI SADA

- `code infra/k8s/ingress-srv.yaml`

***

ps. DA VIDIS SVE KUBER. SERVICE POKRENI `k get services`

***

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ingress-srv
  annotations:
    kubernetes.io/ingress.class: nginx
spec:
  rules:
    - host: "myblog.com"
      http:
        paths:

          - path: /posts
            pathType: Exact
            backend:
              service:
                name: query-srv
                port:
                  number: 4002

```

KAO STO VIDIS, SADA BI TREBALO DA SE HITT-UJE PORT 4002 ONOG query-srv CLUSTER IP SERVICE-A

MORAS SADA DA REBUILD-UJES CONFIG

- `cd infra/k8s`

- `kubectl apply -f ingress-srv.yaml`

MOZES I OVO DA TESTIRAS DA PROBAS DA VIDIS DA LI CE REQUEST NA KRAJU STICI DO query MICROSERVICE-A

- `http GET myblog.com/posts`

REQUEST JE BIO USPESAN, DOBI OSAM NAZAD PRAZAN OBJEKAT, JER NMAM KREIRANIH POSTOVA U MOM 'IN MEMORY DATBASE'-U INSIDE MICROSERVICE

```zsh
HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
Connection: keep-alive
Content-Length: 2
Content-Type: application/json; charset=utf-8
Date: Tue, 23 Mar 2021 17:06:34 GMT
ETag: W/"2-vyGp6PvFo4RvsFtPoIWeCReyIC8"
X-Powered-By: Express

{}
```

# UVID U INGRESS CONTROLLER

TO MOZES URADITI SA SLEDECOM KOMANDOM:

`kubectl describe ingress <ime ingres service-a>`

IME JE ONO U KOJE SAM MU DAO U FILE-U (infra/k8s/ingress-srv.yaml)

- `k describe ingress ingress-srv`

```zsh
Name:             ingress-srv
Namespace:        default
Address:          192.168.49.2
Default backend:  default-http-backend:80 (<error: endpoints "default-http-backend" not found>)
Rules:
  Host        Path  Backends
  ----        ----  --------
  myblog.com  
              /posts   query-srv:4002 (172.17.0.6:4002)
Annotations:  kubernetes.io/ingress.class: nginx
Events:
  Type    Reason  Age                From                      Message
  ----    ------  ----               ----                      -------
  Normal  CREATE  26m                nginx-ingress-controller  Ingress default/ingress-srv
  Normal  CREATE  25m                nginx-ingress-controller  Ingress default/ingress-srv
  Normal  UPDATE  24m (x2 over 25m)  nginx-ingress-controller  Ingress default/ingress-srv
  Normal  CREATE  5m24s              nginx-ingress-controller  Ingress default/ingress-srv
  Normal  CREATE  4m47s              nginx-ingress-controller  Ingress default/ingress-srv
  Normal  UPDATE  4m46s              nginx-ingress-controller  Ingress default/ingress-srv

```

GORE DAKLE IMAM NEKU UVID (MISLIO SAM DA NEMAM NIKAV UVID U INGRESS CONTROLLER, MEDJUTIM, KAKO VIDIS IMAM)

# PATH TYPE IN INGRESS CONTROLLER CONFIGURTION; WHEN WE ARE SPECIFING PATHS FOR CLUSTER IP SERVICES

O OVOJ TEM ISAM PROCITAO OVDE

<https://kubernetes.io/docs/concepts/services-networking/ingress/#path-types>

**DAKLE ZATO SAM U KONFIGURACIJI ZADAO ONAJ `pathType`; DA NISAM, FAIL-OVAL BI KONFIGURACIJA**

# PROBACU DA SPECIFICIRAM PATH, KOJIM BI DIRECT-OVO TRAFFIC DO CLUSTER IP SERVICE-A ONOG PODA-A, MICROSERVICE-A, CIJA JE ULOGA KRIRANJE JEDNOG BLOG POST-A

- `code infra/k8s/ingress-srv.yaml`

EVO TO SAM URADIO

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ingress-srv
  annotations:
    kubernetes.io/ingress.class: nginx
spec:
  rules:
    - host: "myblog.com"
      http:
        paths:
          - path: /create
            pathType: Exact
            backend:
              service:
                name: posts-srv
                port:
                  number: 4000
          - path: /posts
            pathType: Exact
            backend:
              service:
                name: query-srv
                port:
                  number: 4002
```

DAKLE U PITANJU JE `posts-srv` CLUSTER IP SERVICE, SA PORTOM 4000

ONO STO TI MOZE BITI INTERESANTNO JESTE, STO SAM ZA PATH SPECIFICIRAO `/create` (IM SMISLA JER SE RDI O KREIRANJU POST-A)

SADA CU DA LOOK-UJEM INTO INGRESS CONTROLLER ONCE AGAIN

- `kubectl describe ingress ingress-srv`

```zsh
Name:             ingress-srv
Namespace:        default
Address:          192.168.49.2
Default backend:  default-http-backend:80 (<error: endpoints "default-http-backend" not found>)
Rules:
  Host        Path  Backends
  ----        ----  --------
  myblog.com  
              /create   posts-srv:4000 (172.17.0.5:4000)
              /posts    query-srv:4002 (172.17.0.6:4002)
Annotations:  kubernetes.io/ingress.class: nginx
Events:
  Type    Reason  Age                From                      Message
  ----    ------  ----               ----                      -------
  Normal  UPDATE  42m (x2 over 63m)  nginx-ingress-controller  Ingress default/ingress-srv

```

**ALI AKO MAKE-UJES REQUEST AGAINST `/create` DOBICES 404**

HAJDE DA PROBAMO

- `http POST myblog.com/create title="Hi I am Stavros"`

```zsh
HTTP/1.1 404 Not Found
Access-Control-Allow-Origin: *
Connection: keep-alive
Content-Length: 146
Content-Security-Policy: default-src 'none'
Content-Type: text/html; charset=utf-8
Date: Tue, 23 Mar 2021 18:30:48 GMT
X-Content-Type-Options: nosniff
X-Powered-By: Express

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Error</title>
</head>
<body>
<pre>Cannot POST /create</pre>
</body>
</html>
```

**DAKLE ZAISTA SAM DOBIO 404**

A ZASTO?

# PA TVOJ NODE, ODNOSNO EXPRESS posts MICROSERVICE (NA CIJI CLUTER IP SERVICE TI SALJES TRAFFIC) NE HANDLE-UJE PATH `/create`; I TO MOZES SADA DA ISPRAVIS

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

  console.log({ type, payload });

  res.send({});
});

app.get("/posts", (req, res) => {
  res.status(200).send(posts);
});

// EVO KAKO VIDIS OVAJ ROUTE JE ODGOVORAN ZA KREIRANJE NOVOG POST
// DOKUMENTA U IN MEMORY DATABASE-U (OBICNOM JAVASCRIPT OBJEKTU)
// ALI KAKO VIDIS, NJEGOV ROUTE JE /posts
// app.post("/posts", async (req, res) => {
// MEDJUTIM JA SAM DEFINISAO DA INGRESS CONTROLLER DIRECT-UJE TRAFFIC TO /create
// ZATO SAM OVO IMENIO DA BU DE /create
app.post("/create", async (req, res) => {
  const { title } = req.body;
  const id = randomBytes(4).toString("hex");
  posts[id] = { id, title };

  try {
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

## ALI SADA MORAS DA REBUILD-UJES DOCKER IMAGE, PUSH-UJES GA U DECKER HUB I ONDA RESTART-UJES DEPLOYMRNT, A KOJ ICE DURING THAT UZETI NOVI IMAGE, I SA NJI MDALJE SAGRADITI NOVI PO I UNISTITI PREDHODNI

- `cd posts`

- `docker images`

```zsh
REPOSITORY                    TAG              IMAGE ID       CREATED        SIZE
radebajic/query               latest           42011a95431f   45 hours ago   125MB
radebajic/event_bus           latest           048ba80dba60   46 hours ago   125MB
radebajic/query               <none>           e2d1b50fbf03   46 hours ago   125MB
radebajic/comments            latest           9e74d6df602c   46 hours ago   125MB
radebajic/moderation          latest           372340ff8531   46 hours ago   125MB
radebajic/event_bus           <none>           0d23effcbbb2   2 days ago     125MB
radebajic/posts               latest           c2a3c909a16b   2 days ago     125MB
radebajic/event_bus           <none>           d4bb9439e1e3   2 days ago     125MB
radebajic/posts               <none>           407c80c78664   2 days ago     125MB
node                          lts-alpine3.12   8f86419010df   11 days ago    117MB
gcr.io/k8s-minikube/kicbase   v0.0.18          a776c544501a   3 weeks ago    1.08GB
```

- `docker build -t radebajic/posts .`

- `docker push radebajic/posts`

DAKLE SADA CU DA RELOAD-UJEM TAJ DEPLOYMENT KOJI CE SA DOCKER HUB-UZETI IMAGE I NAPRAVITI NOVI PODS ZA posts MICROSERVICE NODE, ODNOSNO EXPRESS APLIKACIJU

- `k get deployments`

```zsh
NAME              READY   UP-TO-DATE   AVAILABLE   AGE
comments-depl     1/1     1            1           46h
event-bus-depl    1/1     1            1           2d4h
moderation-depl   1/1     1            1           46h
posts-depl        1/1     1            1           2d22h
query-depl        1/1     1            1           46h

```

- `cd posts`

- `kubectl rollout restart deployment posts-depl`

## SADA BI TREBAL ODA JE ONAJ NODE APP KOJI JE U PODU posts MICROSERVICE-A PROMENJEN

HAJDE CISTO RADI VEZBE DA VIDIS DA LI CODE PROMENJEN

UCI CU U SHELL TOG RUNNING POD-A

- `k get pods`

```zsh
NAME                              READY   STATUS    RESTARTS   AGE
comments-depl-7f85b5f495-nhtsd    1/1     Running   6          46h
event-bus-depl-74c646ff5c-mth5g   1/1     Running   6          45h
moderation-depl-fc77b94df-xngmn   1/1     Running   6          46h
posts-depl-86ccd45d89-slp4r       1/1     Running   0          68s
query-depl-76bb598fcd-shq2n       1/1     Running   6          44h
```

ZELIM DA LOOK-UJEM INTO FILE SYSTEM `posts-depl-86ccd45d89-slp4r` PODA

- `kubectl exec -it posts-depl-86ccd45d89-slp4r sh`

```sh
/app # ls
Dockerfile         index.js           node_modules       package-lock.json  package.json       yarn.lock
/app # cat index.js
# DA TI NE PRIKAZUJEM CEO FIE, ALI VIDECES DA JE
# ZAISTA PROMENJNO ONO STO JE TREBALO DA SE
# ANTICEAPATE-UJE REQUEST ZA /create A NE ZA /posts
app.post("/create", async (req, res) => {
...

/app # exit
```

# E SADA CU DA POSALJEM POST REQUEST KA `myblog.com/create`

- `http POST myblog.com/create title="Hi I am Stavros"`



## STO SE TICE REACT APPLIKACIJE, POTREBNO JE DA IZMENIMO CODE U KOJEM PRAVIM REQUEST-OVE, KAKO BI ONI HITTOVALI `myblog.com`, ALI PRE TOGA MORACU DA POVEZEM JOS JEDAN CLUSTER API SERVICE SA INGRESS CONTROLLEROM; ZATO STO IZ MOG REACT APP-A JA SALJEM REQUESTS ZA GETTING ALL POSTS, KOJI TREBA DA HITT-UJE query MICROSERVICE

NAIME, JA SAM PODESIO DA DA INGRESS CONTROLLER RAZGOVARA SA CLUSTER IP SERVICE-OM KOJI JE IN FRONT OF POD U KOJEM JE CONTAINER `posts` MICROSERVICE-A

ALI TAJ POMNUTI MICROSERVICE JE KOD MENE DEFINISAN SAMO DA PRIHVATA SINGLE DOCUMENT CREATION, STO ZNACI DA SE AGAINT MICROSERVICE SALJE 'POST' REQUEST A U BODY-JU JE title PROPERTI SA IMENOM POST-A

SLEDECA STVAR JE KREIRANJE COMMENTSA, STO SE OBAVLJA KROZ `comments` MICROSERVICE

I TREBA EXPOSE-OVATI I `query` MICROSERVICE

## TAKO DA CI POPRAVITI TO SADA REDEFINISUCI INGRESS CONTROLLER KONFIGURACIJU, REDEFINISUCI SVE TAKO DA DEFINISEM DA INGRESS CONTROLLER PROSLEDJUJE TRAFFIC DO CLUSTER IP SERVICE-A, KOJI SEDE IN FRONT OF PODS ZA `posts` MICROSERVICE, ZATIM `comments` MICROSERVICE, ZATIM I `query` MICROSERVICE

ZATO CU POTPUNO IZMENITI TAJ DEO KONFIGURACIJE SA ROUTE-OVIMA

PATH KOJ CU ZADATI ZA query-srv CLUSTER IP SERVICE BICE `/posts` JER RELATED NODE APLIKACIJA SERVIRA SVE POSTOVE I COMENTARE U JEDNOM TOM REQUEST-U

PATH KOJI CU ZADATI ZA posts-srv CLUSTER IP SERVICE BICE `/create_post` JER TAJ IP SERVICE STOJI ISPRED NODE APLIKACIJE ZA KREIRANJE SINGLE POST-A

PATH KOJI CU ZADATI ZA comments-srv CLUSTER IP SERVICE BICE `/create_comment` JER TAJ IP SERVICE STOJI ISPRED NODE APLIKACIJE ZA KREIRANJE SINGLE COMMENT-A

**LOGICNO SAM RAZMISLJAO KAKVI TREBA DA BUDU OVI POMENUTI ROTE-OVI I ZATO SAM IH TAKO ZADAVAO**

DAKLE TREBAM CLUSTER IP SERVISE

- `k get services`

```zsh
NAME             TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)          AGE
comments-srv     ClusterIP   10.108.43.70     <none>        4001/TCP         38h
event-bus-srv    ClusterIP   10.103.22.50     <none>        4005/TCP         42h
kubernetes       ClusterIP   10.96.0.1        <none>        443/TCP          3d23h
moderation-srv   ClusterIP   10.97.129.13     <none>        4003/TCP         38h
posts-dev-srv    NodePort    10.105.170.31    <none>        4000:31690/TCP   42h
posts-srv        ClusterIP   10.105.230.95    <none>        4000/TCP         45h
query-srv        ClusterIP   10.101.226.177   <none>        4002/TCP         38h
```

DAKLE ODOZGO MENI TREBA query-srv, comments-srv I posts-srv, JER SU TI CLUSTER IP SERVISI SA KOJIMA INGRESS KONTROLLER TREBA DA IMA TRAFFIC IZMEDJU

- `code infra/k8s/ingress-srv.yaml`

```yaml
apiVersion: networking.k8s.io/v1beta1
kind: Ingress
metadata:
  name: ingress-srv
  annotations:
    kubernetes.io/ingress.class: nginx
spec:
  rules:
    - host: myblog.com
      http:
        paths:
          - path: /posts
          - path: 
            backend:
              # ZATO STO Qquery MIKROSERVISE TREBA DA UZME
              # SVE POSTS ICOMMENTS (ZATO JE LOGICN ODA ON IMA
              # /posts)
              # UMESTO OVOGA 
              # serviceName: posts-srv
              # OVO
              serviceName: query-srv
              # I UMESTO OVOGA 
              # servicePort: 4000
              # OVO
              servicePort: 4002
          # A SADA CU DA SPECIFICIRAM I NOVA DVA CLUSTER IP SERVISA
          - path: /create_post
            backend:
              serviceName: posts-srv
              servicePort: 4000
          - path: /create_comment
            backend:
              serviceName: comments-srv
              servicePort: 4001

```


- `cd infra/k8s`

- `k apply -f ingress-srv.yaml`

PROBAJ SADA DA KREIRAS POST

ALI NE ZABORAVI DA JE TAKAV EXPRESS APP DA TI TAM OTREBA I `/posts` ATO STO SI TAKO DEFINISAO UNUTAR EXPRESS MICROSERVICE-A

- `http POST myblog.com/create_post/posts title="Stavros looking at you"`

COMMENT NECU OVDE PROBATI DA KRIRAM, JER TI TREBA JOS ARGUMENATA, KAO STO JE RELATED POST ID (TO CU TI POKAZATI KROZ REACT APP) (USTVARI NA OSNOVU TOG ID-J KRIRACE SE PATH NEOPHODAN ZA EXPRESS APP I ZATO NE MOGU TO OVAKO OVDE NAPAMET)

PROBAJ DA UZMES SVE POSTS

- `http GET myblog.com/posts`

USPESNO SAM NAPRAVIO REQUEST

```zsh
HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
Connection: keep-alive
Content-Length: 2
Content-Type: application/json; charset=utf-8
Date: Tue, 23 Mar 2021 10:50:19 GMT
ETag: W/"2-vyGp6PvFo4RvsFtPoIWeCReyIC8"
X-Powered-By: Express

{}

```

# SADA MOZES DA PREPRAVIS URL-OVE U REACT APLIKCIJI, ODNOSNO URL-OVE U FRONT END CODE-U, AGAINST WHO YOU ARE SNEDING NETWORK REQUESTS

TAKAV TI JE APP DA TI TREBAJU URL-OVI BASED ON 

- `code client/src/PostList.tsx`

```tsx
import React, { FC, useCallback, useEffect, useState } from "react";
import axios from "axios";

import CommentCreate from "./CommentCreate";

import CommentList from "./CommentList";

const PostList: FC = () => {
  const [posts, setPosts] = useState<
    {
      id: string;
      title: string;
      comments: {
        id: string;
        content: string;
        postId: string;
        status: string;
      }[];
    }[]
  >([]);

  const getPostsCallback = useCallback(async () => {
    // UMESTO OVOGA
    // const res = await axios.get("http://localhost:4002/posts", {
    // PISEM OVO
    const res = await axios.get("http://myblog.com/posts", {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const posts: {
      [key: string]: {
        title: string;
        id: string;
        comments: {
          id: string;
          content: string;
          postId: string;
          status: string;
        }[];
      };
    } = res.data;

    const normalizedPosts = Object.values(posts);

    setPosts(normalizedPosts);
  }, [setPosts]);

  useEffect(() => {
    getPostsCallback();
  }, [getPostsCallback]);

  return (
    <div>
      {posts.map(({ id, title, comments }) => (
        <div
          key={id}
          className="card d-flex flex-row flex-wrap justify-content-between"
          style={{ width: "30%", marginBottom: "20px" }}
        >
          <div className="card-body">
            <h3>{title}</h3>
            <CommentCreate postId={id} />

            <CommentList postId={id} comments={comments} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostList;

```


***
***
***
***
***
***
***

```yaml
nginx.ingress.kubernetes.io/use-regex: "true"
```

```yaml
- path: /posts/create
  pathType: Prefix
  backend:
    service:
      name: posts-srv
      port:
        number: 4001
```

