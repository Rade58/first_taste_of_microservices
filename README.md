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



***
***
***
***
***
***
***
***


