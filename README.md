# WRITING Ingress CONFIG FILES

U PROSLOM BRANCHU SAM NAPRAVIO `INGRESS CONTROLLER-A` U NASEM CLUSTER-U, KROZ UPOTREBU [`ingress-nginx`](https://kubernetes.github.io/ingress-nginx/deploy/#minikube)

SADA MORAM TOG KONTROLERA DA NAUCIM NKIM ROUTING RULES-OVIMA, AND TELL HIM HOW TO TAKE INCOMMING REQUESTS I POSALJE IH TO SOME APPROPRIATE PODS

# KREIRACU CONFIG FILE KOJI CE CONTAIN-OVATI SOME ROUTER RULES

MEDJUTIM TREBACE MI URL-OVI ZA CLUSTER IP SERVICES

USTVARI NE URL-OVI VEC VREDNOSTI

- `kubectl get services`

```zsh
NAME             TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)          AGE
comments-srv     ClusterIP   10.108.43.70     <none>        4001/TCP         23h
event-bus-srv    ClusterIP   10.103.22.50     <none>        4005/TCP         28h
kubernetes       ClusterIP   10.96.0.1        <none>        443/TCP          3d9h
moderation-srv   ClusterIP   10.97.129.13     <none>        4003/TCP         23h
posts-dev-srv    NodePort    10.105.170.31    <none>        4000:31690/TCP   27h
posts-srv        ClusterIP   10.105.230.95    <none>        4000/TCP         31h
query-srv        ClusterIP   10.101.226.177   <none>        4002/TCP         23h
```

KORISTICU ONO UNDER NAME I UNDER PORT

- `touch infra/k8s/ingress-srv.yaml`

```yaml
apiVersion: networking.k8s.io/v1beta1
kind: Ingress
metadata:
  name: ingress-srv
  annotations:
    kubernetes.io/ingress.class: nginx
spec:
  rules:
    - host: posts.com
      http:
        paths:
          - path: /posts
            backend:
              serviceName: posts-srv
              servicePort: 4000

```

OPCIJA annotation CE POMOCI INGRESS CONTROLLER-U DA RZUME DA MI POKUSAVAMO DA GA NAHRANIM OSA SOME ROUTING RULES

INGRESS CONTROLLER CE NASTAVITI DA SKENIR ALL THE DIFFERENT OBJECTS ILI SVE DRUG CONFIG FILES, KOJE THROW-UJEMO IN OUR CLUSTER, NACI CE ONAJ KOJI IMA ISTI SPECIFICIRANI annotation

KADA TO NADJE INGRESS CONTROLLER CE RECI "OH THIS THING MUST HAVE SOME ROUTING RULES FOR ME"

rules IMA SVE ROUTING RULES KOJE HOCU DA APPLY-UJEM DA BI NAUCIO INGRESS CONTROLLER, KAK ODA UZIMA INCOMMING TRAFFIC I ROUTE-UJE GA DO CLUSTER IP SERVICE-A VEZANIH ZA PODS

**MOZE TI BITI NEJASNO STA ZNACI GORE `posts.com`** (TO CU TI USKORO OBJSNITI)

DAKLE JA NISAM POBROJAO, TAKORECI SVE CLUSTER IP SERVISE

NEMA VEZE KASNIJE CU, A SADA DA FEED-UJEM CONFIG

# FEED-OVACU FILE TO OUR CLUSTER, GDE CE AUTMATSKI BITI DISCOVERED BY INGRESS CONTROLLER

- `cd infra/k8s`

- `kubectl apply -f ingress-srv.yaml`

S OVIM SAM UPDATE-OVAO ROUTING RULES INGRESS CONTROLLER-A, KAKO BI MATCH-OVAO ONE KOJE SAM MU DAO


