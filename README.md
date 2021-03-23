# DEPLOYING THE REACT APP

***
***

digresija:

U PROSLOM BRANCH-U SAM POGRESNO DEFINISAO KOJ JE TO CLUSTER IP SERVISE PREMA KOJEM INGRESS CONTROLLER PROSLEDJUJE TRAFFIC

A TO CU POPRAVITI OVDE

***
***

MORAM SE PRVO PODSETITI STA SAM URADIO U PROSLOM BRANCH-U

DAKLE U PROSLOM BRANCH-U SAM NAPRAVIO CONFIG ZA `INGRESS CONTROLLER`

ON CE UCINITI DA KADA SALJEM REQUEST NA IP MOG CLUSTERA DA SE USTVARI ONDA REQUEST PROSLEDI DO CLUTER IP SERVICE-A OSTALIH POD-OVA GDE SU MOJE NODE MICROSERVICE APLIKACIJE (USTVARI ZA SADA JE TO SETT-OVANO SAMO za posts SERVICE ,EVO POGLEDAJ I SAM)

ODNOSNO ZA SADA SAMO KADA SE SALJE REQUEST PREMA `posts-srv` CLUSTER IP SERVISU, USTVARI REQUEST STIZE DO SAME NODE APLIKACIJE

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

**KAO STO VIDIS GORE, PODESIO SAM I TO DA OVAJ INGRESS CONTROLLER SAMO PRIHVATA REQUESTS SA DOMAIN-A `myblog.com`**

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

***
***

## STO SE TICE REACT APPLIKACIJE, POTREBNO JE DA IZMENIMO CODE U KOJEM PRAVIM REQUEST-OVE, KAKO BI ONI HITTOVALI `myblog.com`, ALI MORACU DA POPRAVIM JEDNU GRESKU SA INGRESS-OM, KOJA NIJE GRESKA VEC SAMO DIRECTING TRAFFIC-A DO POGRESNOG CLUSTER API SERBVICE-A

ZATO STO SADA JA PRAVIM REQUESTS PREMA query MICROSERVICE-U KAO DA JE TAJ MICROERVICE NA ISTOJ VIRTUAL MACHINE-I ILI ISTOM RACUNARU KAO I REACT APP IZ KOJEG SALJEM REQUESTS, KORISTI SE LOCALHOST

A ONO OD CEGA TREBAM DA SAGRADIM URL, JESTE `myblog.com` I TO CE SLATI REQUEST DO INGRESS CONTROLLER-A, I MORAM DODATI EKSTENZIJU, ONDONO ROUTE, KOJI SAM DEFINISAO KAO ROUTE DO KOJEG INGRESS KONTROLER PROSLEDJUJE REQUEST

JA SAM NAPRAVIO GRESKU DEFINISUCI INGRESS KONTROLER-A, ZATO STO SAM EXPOSE-OVAO IPAK POGRESAN CLUSTER IP

ZASTO TO KAZEM?

ZATO STO JE MOJA REACT APLIKACIJA ORIGINALNO TREBALA DA KOMUNICARA SAM OSA query MICROSERVISOM, A JA SAM EXPOSE-OVAO posts MICROSERVIS

## TAKO DA CI POPRAVITI TO SADA REDEFINISUCI INGRESS CONTROLLER KONFIGURACIJU

DKLE TREBAM CLUSTER IP SERVIS ZA query A NE ZA posts

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

DAKLE ODOZGO MENI TREBA query-srv KAO TAJ SA KOJI INGRESS KONTROLLER IMA TRAFFIC IZMEDJU

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
              # UMESTO OVOGA 
              # serviceName: posts-srv
              # OVO
              serviceName: query-srv
              # UMESTO OVOGA 
              # servicePort: 4000
              # OVO
              servicePort: 4002

```

/posts MI ODGOVARA JER JE TAKAV EXPRESS ENDPOINT U query MICROSERVICE-U

- `cd infra/k8s`

- `k apply -f ingress-srv.yaml`

PROBAJ SADA DA POSALJES GET REQUEST DA UZMES SVE POSTS

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
