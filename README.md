# DEPLOYING REACT APP

POCECU OD TOGA DA CU DA MODIFIKUJEM CODEBASE REACT APP-A, TACNIJE, ONA MESTE GDE SALJEM NETWORK REQUESTS

IMAM TAKVA TRI URL-A, KOJA MOGU OBTAIN-OVATI OVDE (NJIH SAM IZMEDJU OSTALOG SETT-OVAO U PREDHODNIH NEKOLIKO BRANCHEVA, KROZ INGRESS CONTROLLER KONFIGURACIJU)

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
              /create                      posts-srv:4000 (172.17.0.9:4000)
              /posts                       query-srv:4002 (172.17.0.6:4002)
              /post/?(.*)/comment_create   comments-srv:4001 (172.17.0.5:4001)
Annotations:  kubernetes.io/ingress.class: nginx
              nginx.ingress.kubernetes.io/use-regex: true
Events:
  Type    Reason  Age                  From                      Message
  ----    ------  ----                 ----                      -------
  Normal  UPDATE  37m (x5 over 4h56m)  nginx-ingress-controller  Ingress default/ingress-srv
```

A MOGAO SI DA POGLEDAS U FILE `infra/k8s/ingress-srv.yaml` I IZ NJEGA DA IZVUCES ZAKLJUCKE KAKO DA SAGADIS URLS

IMAM TRI URL-A, JEDAN ZA GETTIN ALL POSTS AND COMMENTS, DRUGI ZA POST CREATION I TRECI ZA COMMANT CREATION

`http://myblog.com/posts`
`http://myblog.com/create`
`http://myblog.com/post/:id/comment_create`

SADA CU DA UPOTREBIM SVE TE URL-OVE U REACT KOMPONENTAMA

NECU IH STMAPATI SAMO CU TI OSTAVITI FILE-OVE GDE SAM TO URADIO

`cat client/src/PostList.tsx`
`cat client/src/PostCreate.tsx`
`cat client/src/PostCreate.tsx`

MOZES SAM OTVORITI TE FILE-OVE VIDETI STA SAM TO URADIO

## MOGU SADA SAGRADITI I DOCKER IMAGE ZA MOJ REACT APP



***
***
***
***
***
***
***
***


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

