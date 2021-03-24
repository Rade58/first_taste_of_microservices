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

MOZES SAM OTVORITI TE FILE-OVE VIDETI STA SAM TO URADIO (CAK JE COMMENTED STA JE PROMENJENO)

## MOGU SADA SAGRADITI I DOCKER IMAGE ZA MOJ REACT APP, I DA IMAGE PUSH-UJEM TO DOCKER HUB

AKO SE SECAS, VEC SAM PODESIO Dockerfile U REACT APP-U

- `cd client`

- `docker build -t radebajic/client .`

- `docker push radebajic/client`

## MOGU SADA POCETI DA DEFINISEM KONFIGURACIJU ZA PRAVLJENJE DEPLOYMENT OBJECT-A, KAO I CLUSTER IP SERVIICE-A ZA POD U KOJEM CE BITI NAS REACT APP

MOZES KOPIRATI NEKU DRUGU KONFIGURACIJU DEPLOYMENT-A I CLUSTER IP SERVICE-A, RECIMO `infra/k8s/posts-depl.yaml` I SAMO JE PREPRAVITI

- `touch infra/k8s/client-depl.yaml`

VODI RACUNA DA UPISES PRAVI PORT (REACT APP SE SERVE-UJE NA PORTU 3000)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: client-depl
spec:
  replicas: 1
  selector:
    matchLabels:
      app: client
  template:
    metadata:
      labels:
        app: client
    spec:
      containers:
        - name: client
          image: radebajic/client:latest
---
apiVersion: v1
kind: Service
metadata:
  name: client-srv
spec:
  selector:
    app: client
  type: ClusterIP
  ports:
    - name: client
      protocol: TCP
      port: 3000
      targetPort: 3000
```

GRADIM DEPLOYMENT OBJECT I CLUSTER IP SERVICE ZA MOJ REACT APP

- `cd infra/k8s`

- `kubectl apply -f client-depl.yaml`

DKLE APLICIRAO SMA POMENUTUE KONFIGURACIJE NA MOJ KUBERNETES CLUSTER

# SADA TREBAM DA MODIFIKUJEM NGNIX KAKO BI INGRESS CONTROLLER USTVARI DIRECT-OVAO TRAFFIC DO client-srv CLUSTER IP SEVICE-A, KADA KORISNIK REQUEST-UJE `/`, ALI NE SAMO / VEC I `/` A IZA NJEGA BIILO STA STO NIJE ONO STO JE DEO DRUGIH PATH-OVA

- `code infra/k8s/ingress-srv.yaml`

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
          - path: /?(.*)
            pathType: Exact
            backend:
              service:
                name: client-srv
                port:
                  number: 3000


```

DAKLE JA SAM GORE DODAO POSLEDNJI PATH, KAO STO MOZES GORE VIDETI

BITNO JE RECI DA JE ORDER OVIH GORNJIH PATH-OVA VAZAN:

**ORDER IDE OD GREATEST IMPORTANCE DO LESS ONES**

KADA SE AHTEVA PATH, KOJI JE :  `/` + `NESTO`

**PRVO CE SE MATCH-OVATI DA LI JE TO NESTO `/create`; AKO TO NIJE ONDA CE SE TRAZITI MATCH ZA `/posts`; AKO TO NIJE, TRAZICE SE MATCHING ZA `/post/?(.*)/comment_create`; I TEK AKO TO NIJE BICE MATCHED `/ + 'BILO STA'`, ILI OBJASNJENO REGEXPOM TO JE ?(.*)** 

STO BI ZNACILO DA TAJ NAJMANJE ODREDJEN REGEXP MATCH-UJE, NESTO SA NAJMANJE IMPORTANCE (JER OSTALI PATH-OVI IMAJU DELOVE KOJI SE SASTOJE OD KONKRETNIH KARAKTERA, DO KJE OVDE U PITANJU CIST REGEXP KOJI MATCH-UJE BILO KOJI KARAKTER I U BILO KOJEM BROJU) (I UPRAVO TU SERVE-UJEM MOJ REACT APP) (ISPPITACEMO TO KASNIJE KADA DEPLOY-UJEMO I KADA BUDES DODAO BIL OSTA NAKO NSLASH-A)

SADA CU DA REBUILD-UJEM INGRESS

- `cd infra/k8s`

- `kubectl apply -f ingress-srv.yaml`

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
              /create                      posts-srv:4000 (172.17.0.3:4000)
              /posts                       query-srv:4002 (172.17.0.2:4002)
              /post/?(.*)/comment_create   comments-srv:4001 (172.17.0.5:4001)
              /?(.*)                       client-srv:3000 (172.17.0.9:3000)
Annotations:  kubernetes.io/ingress.class: nginx
              nginx.ingress.kubernetes.io/use-regex: true
Events:
  Type    Reason  Age                From                      Message
  ----    ------  ----               ----                      -------
  Normal  CREATE  71m                nginx-ingress-controller  Ingress default/ingress-srv
  Normal  CREATE  71m                nginx-ingress-controller  Ingress default/ingress-srv
  Normal  UPDATE  70m                nginx-ingress-controller  Ingress default/ingress-srv
  Normal  CREATE  56m                nginx-ingress-controller  Ingress default/ingress-srv
  Normal  CREATE  56m                nginx-ingress-controller  Ingress default/ingress-srv
  Normal  UPDATE  22s (x2 over 56m)  nginx-ingress-controller  Ingress default/ingress-srv

```

# TI SAD MOZES OTVORITI REACT APP U BROWSER-U

U ADRESS BAR UNOSIO SAM `myblog.com`, ZATIM `myblog.com/`, ZATIM `myblog.com/nesto_random` (BITNO JE DA OVO `nesto_random` NIJE ISTO KAO OSTALI PATH-OVI, JER TAKO CU SLATI REQUEST, PREM DRUGIM MOJIM SERVICE-IMA, KOROZ INGRESS NARAVNO)
**I ZISTA MOJ REACT APP JE BIO LIVE IN BROWSER ,STO ZNACI DA JE INITAL HRTML CSS AND JS USPESNO SERVED**

MOZES DA PROBAS DA NAPRAVIS POST, PA DA RELOAD-UJES PAGE, PA DA ODNDA NAPRAVIS KOMENTAR, I RELOAD-UJES, I ZISTA I MOJ REACT APP, I SVI UNDERLINING DOCKERIZED AND CLUSTERIZED MICROSERVISI FUNKCIONISU


****


***
***
***
***
***
***
***
***


