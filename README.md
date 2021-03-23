# INGRESS CONTROLLER: SETTING DYNAMIC PATHS

TVOJ `comments` MICROSERVICE KOJI IMA SVOJ CONTAINER U POD-U, KOJI JE UNUTAR, SVOG DEPLOYMENTA ANTICAPATE-UJE REQUEST, NA PATH-U KOJ IJE DYNAMIC

DYNAMMIC PART JE `RELTED POST ID`

ON IZGLEDA OVAKO

`/posts/:id/comments`

***
***

digresija:

SAMO DA TI KAZEM DA CU U BUDUCE DA GA IZMENIM DA IZGLEDA MALO BOLJE, RECIMO OVAKO: `/post/:id/create_comment`

I TO SAM PROMENIO U `comments/index.js` FAJLU GDE JE EXPRESS SERVER (MRZI ME DA TI POKAUJEM, POGLEDAJ STA SAM TAMO STAVIO)

ALI KADA SAM TO IZMENIO GLAVNA STVAR JE DA SAM URADIO OVO

- `cd comments`

- `docker build -t radebajic/comments .`

- `docker push radebajic/comments`

- `kubectl get deployments`

- `kubectl rollout restart deployment comments-depl`

***
***

# DAKLE, POSTO JA IMAM DYNAMIC PATH, JA CU MORATI DA DEFINISEM KAKO DA NGINX HANDLE-UJE TAJ PATH; MORACU USTVARI KORISTITI REGULAR EXPRESSION

TAKO DA CU MORATI DA DODAM JOS KONFIGURACIJE U INGRESS CONTROLLER CONFIGURATION FILE

DODACU DEO CONFIG-A, KOJI CE OMOGUCITI DA SE MOZE KORISTITI REGULAR EXPRESSION ZA PATH MACHINNG

A ONDA CU DA SA REGULAR EXPRESSION-OM DEFINISEM DINAMICKI DEO PATHA

A TAJ PATH, KOJI IMA TAJ SVOJ DINAMICKI DEO, CE BITI DEO URL-A ZA CLUSTER IP SERVICE KOJI STOJI ISPRED POD-A U KOJEM JE comments EXPRESS MICROSERVICE

- `kubectl get services`

DA OMOGUCIM REGULAR EXPRESSION, KAKO VIDIS DOLE ZADAO SAM `nginx.ingress.kubernetes.io/use-regex: 'true'` UNDER annotations (BITNO JE A JE 'true' SA NAVODNICIMA)

- `code `

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ingress-srv
  annotations:
    kubernetes.io/ingress.class: nginx
    nginx.ingress.kubernetes.io/use-regex: "true"
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
          - path: /post/?(.*)/create_comment
            pathType: Exact
            backend:
              service:
                name: comments-srv
                port:
                  number: 4001


```

A KAO STO VIDIS DODAO SAM I NOVI PATH, KOJI FORMIRA URL SA OSTALIM STVARIMA, USTVARI OMOGUCAVA DA INGRES CONTROLLER SEND-UJE TRAFFIC DO CLUSTER IP SERVICE-A KOJI JE IN FRONT OF POD-A U KOJEM JE CONTAINARIZOVAN NODEJS comments MICROSERVICE

ALI TAJ PATH KAO STO VIDIS IMA REGULAR EXPRESSION; SECAM SE DA OVAJ OVAKAV REGEXP: `?(.*)` PRVO ZNACI DA MOZE DA SE MATCH-UJE I NISTA (AKO NE STAVIS NISTA), A ONO U ZAGRADI GOVORI DA JE REC O BILO KOJEM KARAKTERU I DA KARAKTERA MOZE BITI NULA ILI VISE

ISTO TAKO VAAN JE I `pathType` A O TOME SAM VISE SAZNAO NA <https://kubernetes.io/docs/concepts/services-networking/ingress/#path-types>

## STO SE TICE REACT APPLIKACIJE, POTREBNO JE DA IZMENIMO CODE U KOJEM PRAVIM REQUEST-OVE, KAKO BI ONI HITTOVALI `myblog.com`, ALI PRE TOGA MORACU DA POVEZEM JOS JEDAN CLUSTER API SERVICE SA INGRESS CONTROLLEROM; ZATO STO IZ MOG REACT APP-A JA SALJEM REQUESTS ZA GETTING ALL POSTS, KOJI TREBA DA HITT-UJE query MICROSERVICE

NAIME, JA SAM PODESIO DA DA INGRESS CONTROLLER RAZGOVARA SA CLUSTER IP SERVICE-OM KOJI JE IN FRONT OF POD U KOJEM JE CONTAINER `posts` MICROSERVICE-A

ALI TAJ POMNUTI MICROSERVICE JE KOD MENE DEFINISAN SAMO DA PRIHVATA SINGLE DOCUMENT CREATION, STO ZNACI DA SE AGAINT MICROSERVICE SALJE 'POST' REQUEST A U BODY-JU JE title PROPERTI SA IMENOM POST-A

SLEDECA STVAR JE KREIRANJE COMMENTSA, STO SE OBAVLJA KROZ `comments` MICROSERVICE

I TREBA EXPOSE-OVATI I `query` MICROSERVICE

## TAKO DA CI POPRAVITI TO SADA REDEFINISUCI INGRESS CONTROLLER KONFIGURACIJU, REDEFINISUCI SVE TAKO DA DEFINISEM DA INGRESS CONTROLLER PROSLEDJUJE TRAFFIC DO CLUSTER IP SERVICE-A, KOJI SEDE IN FRONT OF PODS ZA `posts` MICROSERVICE, ZATIM `comments` MICROSERVICE, ZATIM I `query` MICROSERVICE

ZATO CU POTPUNO IZMENITI TAJ DEO KONFIGURACIJE SA ROUTE-OVIMA

PATH KOJ CU ZADATI ZA querAy-srv CLUSTER IP SERVICE BICE `/posts` JER RELATED NODE APLIKACIJA SERVIRA SVE POSTOVE I COMENTARE U JEDNOM TOM REQUEST-U

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

