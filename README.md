# CLUSTER IP SERVICE SETUP

NJEGOVA ULOGA JE DA EXPOSE-UJE POD TO OTHER PODS INSIDE YOUR CLUSTER

ALI MI NEMAMO MNOZINU PODOVA, ZATO BI TREBALO DA SAGRADIMO DEPLOYMENTS ZA NASE OSTALE MICRO SERVISE

# BUILDING DEPLOYMENT ZA EVENT BUS

***
***

OVO JE NESTO STA CU MORATI URADITI PRE NEGOO STO SE POZABAVIM CLUSTER IP SERVICE-OM

***
***

ALI ESENCIJALNO ZNAS DA EVENT BUS SALJE NOTIFICATIONS, ODNOSNO EVENTS OSTALIM MICROSERVISIMA, **MEDJUTIM FLOW BI TREBALO DA BUDE TKAV DA SE KOMUNIKACIJA VRSI OD PODA PREMA CLUTER IP-JU DRUGOG SERVICE** (KASNIJE CU OVO TEMELJNIJE OBJASNITI)

ZNACI DA CU SADA SAMO 'KUBERNATIZOVATI' EVENT BUS

TAK ODA IMAM DEPLOYMENT I POD ZA EVENT BUS I, SADA TRENUTNO IMAM ONAJ POD POSTS DEPLOYMENTA

TAKO DA CU IMATI MNOZINU PODOV U CLUSTERU

ALI DA RADIM OVE KORAKE

1. BUILD-UJEM IMAGE ZA EVENT BUS

TAMO SA DAVNO RANIJE VEC NAPRAVIO DO DOCKERFILE, ODNOSNO DOCKERIZOVAO SAM TAJ MICROSERVICE

SADA CU DA BUILD-UJEM IMAGE

- `cd event_bus`

- `docker build -t radebajic/event_bus .`

2. PUSH-UJEM IMAGE TO DOCKERHUB

- `docker push radebajic/event_bus`

3. CREATING DEPLOYMENT CONFIG

- `touch infra/k8s/event-bus-depl.yaml`

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: event-bus-depl
spec:
  replicas: 1
  selector:
    matchLabels:
      app: event-bus
  template:
    metadata:
      labels:
        app: event-bus
    spec:
      containers:
        - name: event-bus
          image: radebajic/event_bus


```

DAKLE POTPUNO ISTA KONFIGURACIJA KAO I KOD POSTS

SAMO SU CHANGED TWO OR THREE NAMES TO REFER TO event_bus A NE posts

5. MORAS IPAK DA KRIRAS DEPLOYMENT, JER SAMO ZA RECREATION, MOZES DA PULL-UJES IMAGE SA DOCKER HUB-A

***

TO TI GOVORIM JER SI MOZDA NASLUTIO DA MOZES DA PULL-UJES SA DOCKER HUB-A I DA REBUILD-UJES DEPLOYMENT

ALI TO TI JE SAMO KOD REBUILD-A (DAKLE PRVO MORAS DA IMAS BUILD) (TADA KORISTIS `k rollout restart <deployment name>`)

***

ZNAJICI GRESKE MINIKUBE-A, UBACICU PRVO IMAGE INSIDE MINIKUBE REGISTRI

- `docker images`

- `minikube cache add radebajic/event_bus`

- `minikube cache list`

SADA CU DA KREIRAM DEPLOYMENT

- `cd infra/k8s`

- `kubectl apply -f event-bus-depl`

- `k get deployments`

- `k get pods`

```zsh
NAME                             READY   STATUS    RESTARTS   AGE
event-bus-depl-74759d587-r7dwx   1/1     Running   0          51s
posts-depl-55b9986456-g2gg4      1/1     Running   1          16h
```
