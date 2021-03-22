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
    - host: myblog.com
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

**MOZE TI BITI NEJASNO STA ZNACI GORE `myblog.com`** (TO CU TI USKORO OBJSNITI)

DAKLE JA NISAM POBROJAO, TAKORECI SVE CLUSTER IP SERVISE

NEMA VEZE KASNIJE CU, A SADA DA FEED-UJEM CONFIG

# FEED-OVACU FILE TO OUR CLUSTER, GDE CE AUTMATSKI BITI DISCOVERED BY INGRESS CONTROLLER

- `cd infra/k8s`

- `kubectl apply -f ingress-srv.yaml`

OVO JE OUTPUT, KOJI IMA WARNING, ALI JE USPESNO KREIRAN ROUTIN RULES

```zsh
Warning: networking.k8s.io/v1beta1 Ingress is deprecated in v1.19+, unavailable in v1.22+; use networking.k8s.io/v1 Ingress
ingress.networking.k8s.io/ingress-srv created

```

S OVIM SAM UPDATE-OVAO ROUTING RULES INGRESS CONTROLLER-A, KAKO BI MATCH-OVAO ONE KOJE SAM MU DAO

**U TEORIJI UPDATE-OVAO SAM KONFIGURACIJU INGRESS CONTROLLER-A**

ALI KAKO OVO TESTIRTI

PA UZ PMOC ONOG myblog.com KOJI SAM SPECIFICIRAO U CONFIG-U

# DA BI USPESNO OVO TESTIRAO MORAM PREVARITI MOJ KOMPJUTER DA KADA HIT-UJE `myblog.com` DA USTVARI CONNECT-UJE SA NEKIM localhost-OM

NAIME, KADA NE KORISTIM KUBERNETES, JA APSOLUTNO MOGU HOST-OVTI JEDNU SINGLE APLIKACIJ AT ONE SINGLE DOMAIN-U

**AL ISA CUBERNETES-OM, MOGU HOST-OVATI TONS OF INFRASTRUCTURE, I NISMO LIMITED DA HOST-UJEMO SAMO ONE SINGULAR APPLICATION; DRUGIM RECIMA, MOZEM ODA HOST-UJEMO MANY APPS AT MANY DIFFERENT DOMAINS `INSIDE SINGLE KUBERNETES CLUSTER`**

MOZES IMATI RECIMO 4 APP NA 4 RAZLICITA DOMAIN-A ;A INFRASTRUKTURU SVA TA 4 APP MOZES HOST-OVATI INSIDE ONE SINGLE KUBERNETES CLUSTER

ingress-nginx JE SETUP-OVAO SVE ASUMING DA TI HOST-UJES MANY DIFFETRENT APPS, ON MANY DIFFERENT DOMAINS

ZATO JE SLUZIO ONAJ `host` FIELD IZ `infra/k8s/ingress-srv.yaml` FAJLA

SA TIM GOVORIMO DA JE CONFIG KOJI PISEMO, UNDER SPECIFIED HOST, DA ZA APP KOJI JE HOSTED NA `myblog.com`

**POSTOJI GOOD SIDE AND BAD SIDE TO THIS**

BAD SIDE JE U TOME STO U DEVELOPMENT ENVIROMENT-U, NAVIKLI SMO DA SVE ACCESS-UJEMO PREKO LOCALHOST-A

TAKO DA MI MORAMO DA TRICK-UJEMO LOCAL MACHINE DA KADA POSECUJE RECIMO `myblog.com` DA JE TO EKVIVALENTNO SA LOCALHOSTOM

## MORAM NAPRAVITI CONFIGURATION CHANGE NA MOM KOMPJUTERU U `/etc/hosts` FAJLU, KAKO BI PREVARIO RACUNAR DA `myblog.com` BUDE USTVARI localhost; ALI U SLUCAJU minikube TO CAK NIJE LOCALHOST

**ODNOSNO MI TRICK-UJEM NGINX DA ON POMISLI DA JE NEKI DRUGI HOST ONAJ myblog.com**

**ALI MENI, USTVARI POSTO IMAM `minikube` CLUSTER ,localhost  NIJE TAJ NA KOJEM HOST-UJEM MOJ CLUSTER, VEC TO JE ONAJ MINICUBE IP**

UZIMAM TJ IP

- `minikube ip`

```zsh
192.168.49.2
```

I NJEGA STAVLJAM KAO DA JE ON `myblog.com`

- `code /etc/hosts`

DOADAO SAM OVAJ LINE NA KRAJU

```vi
# for my kubernetes firts project
# tricking nginx to believe that minikube ip
# is myblog.com

192.168.49.2 myblog.com
```

**DA SI NA MAC ILI WINDOWS-U TVOJ CLUSTER JE HOSTED NA localhost, A TO JE 127.0.0.1**

SADA KADA POKUSAS DA ODES NA `myblog.com`, RATHER THAN GOING THERE YOU'LL END UP NA HOSTU KONA KOJEM JE TVOJ CLUSTER

ZASTO SAM DEFINISAO `myblog.com` U CONFIGU ;ODNOSN OZATO BAS TAJ NAME **PA USTVARI NISTA NIJE SPECIAL ABOUT `myblog.com`, MOGAO SAM SMISLITI BILO KOJI DRUFGI URL**

JEDINO MI JE MAKE-OVAL OSENSE DA TAKVO IME JESTE APPROPRIATE ZA APLIKACIJU KOJ UGRADIM

# ISTO TAKO SMISLAJNJE TOG IMENA `myblog.com` I STAVLJANJA U KONFIGURACIJU JESTE SAMO ZA POTREBE DEVELOPMENT-A

JER KADA POCNEM DA DEPLOY-UJEM MOJ CLUSTER ONLINE, NECU MORATI "VARATI" I DEFINISATI BILLO STA U `/etc/hosts` FAJL NA REMOTE SERVERU ILI ANYTHING LIKE THAT

**JER JA CU TADA KUPITI DOMAIN, I NJEGA CU KORISTITI TAMO GDE SAM SPECIFICIRAO `myblog.com`** (U FAJLU `infra/k8s/ingress-srv.yaml`)

# SADA KADA BI SA HTTPPIE NAPRAVIO REQUEST PREMA `myblog.com` DESICE SE SLEDECE

REQUEST CE BITI USMEREN PREMA INGRESS CONTROLLER

NGINX CE MISLITI DA POKUSAMO DA POSETIMO myblog.com/posts

BICE APPLYED ROUTING rules SPECIFICIRANE U `infra/k8s/ingress-srv.yaml`

ODNOSNO REQUEST CE STICI I DO CLUSTER IP-JA posts-srv SERVICE-A

## SADA CU OVO STVARNO DA TESTIRAM SA `HTTPIE`, TAK OSTO CU REQUEST SLATI AGIANS `myblog.com`

I NEMOJ DA ZABORAVIS EXPRESS-OV ENDPOINT

- `http POST myblog.com/posts title="My name is Stavros"`

```zsh
HTTP/1.1 201 Created
Access-Control-Allow-Origin: *
Connection: keep-alive
Content-Length: 46
Content-Type: application/json; charset=utf-8
Date: Mon, 22 Mar 2021 22:03:27 GMT
ETag: W/"2e-uoz3aTuBk+EPEcUHADsdI3k2+sQ"
X-Powered-By: Express

{
    "id": "2bbd3b2a",
    "title": "My name is Stavros"
}
```

I ZISTA REQUEST JE BIO USPESAN STO ZNACI DA JE INGRESS CONTROLLER USPESNO BIO PREVAREN (USTVARI PREVAREN JE CLUSTER) KADA SAM OTISO NA `myblog.com` MISLECI DA JE myblog.com, USTVARI ONAJ IP DOBIJEN OD `minikube ip` KOMANDE (ODNOSNO IP NA KOJEM JE HOSTED MOJ CLUSTER)

A DALJE JE TRAFFIC USMERIO KA CLUSTER IP SERVISU ZA POD, RELATED TO posts MICROSERVICE, ZATO STO JE BIO PROVIDED `/posts` ENDPOINT 

## SADA CU DA SET-UJEM REACT APP POD

TO CU URADITI U SLEDECEM BRANCH-U

I UPRAVO TAJ APP TREBA DA BUDE SERVED SA `myblog.com/`

KOJI JE USTVARI ZAMASKIRANI IP MOG CLUSTER-A, KAKO SAM TI I OBJASNIO NEKOLIKO PUTA U TEKSTU U OVOM BRANCH-U
