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
          - path: /post/?(.*)/comment_create
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

# REBUILD-OVACU OVU INGRESS KONFIGURACIJU, PA CU POKUSATI DA POSALJEM POST REQUEST PREMA `myblog.com/post/:id/create_comment`

- `cd infra/k8s`

- `kubectl apply -f ingress-srv.yaml`

- `kubectl ingress `

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
  Normal  UPDATE  11s (x5 over 4h19m)  nginx-ingress-controller  Ingress default/ingress-srv
```

**KREIRACU JEDAN POST, DA BI SAMO UZEO NJEGOV ID**

- `http POST myblog.com/create title="Stavros is going"`

```zsh
HTTP/1.1 201 Created
Access-Control-Allow-Origin: *
Connection: keep-alive
Content-Length: 44
Content-Type: application/json; charset=utf-8
Date: Tue, 23 Mar 2021 21:43:43 GMT
ETag: W/"2c-o3F760Cd8jLCod9KROeLgkM858k"
X-Powered-By: Express

{
    "id": "792c3a67",
    "title": "Stavros is going"
}
```

UZIMAM ID POST-A, DA KRIRAM KOMANTAR, A KOMANTAR ZADAJES KAO content (content FIELD SE OCEKUJE U BODY-JU REQUEST-A)

- `http POST myblog.com/post/792c3a67/comment_create content="hi, my name is cool Adam"`

I USPESNO SAM KREIRA OCOMMENT

```zsh
HTTP/1.1 201 Created
Access-Control-Allow-Origin: *
Connection: keep-alive
Content-Length: 73
Content-Type: application/json; charset=utf-8
Date: Tue, 23 Mar 2021 21:44:18 GMT
ETag: W/"49-Z1yJNuqwxBtwSMp2z+mVsFZ94t4"
X-Powered-By: Express

{
    "content": "hi, my name is cool Adam",
    "id": "ec9b82d2",
    "status": "pending"
}
```
