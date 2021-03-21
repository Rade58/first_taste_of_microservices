# CREATING NODE PORT SERVICE

IMAM CONFIG FILE, SADA RUNN-UJEM DOBRO ZNANU KOMMANDU, KOJOM SE KREIRA KUBERNETES OBJEKAT

U OVOM SLUCAJU SERVICE OBJEKAT

- `cd infra/k8s`

- `kubectl apply -f posts-srv.yaml`

```zsh
service/posts-srv created
```

**LISTUJEM SERVICE OBJECTS**

- `k get services`

```zsh
NAME         TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
kubernetes   ClusterIP   10.96.0.1       <none>        443/TCP          2d2h
posts-srv    NodePort    10.105.230.95   <none>        4000:31181/TCP   59s
```

VIDIS KAKO JE TYPE TVOG SERVICE, USTVARI NodePort (TAAKO SI SPECIFICIARAO U CONFIG FILE-U)

**VIDIS I `PORTS` KOLONU**

`4000:31181/TCP` JE PORT TVOG SERVICE-A

OVO JE RANDOMLY ASSIGNED PORT (OVAJ DRUGI BROJ JE GENERATED)

I PREKO OVOG PORTA CES T MOCCI DA ACCESS-UJES SERVICE, KOJI JE NAPRAVLJEN

**TO JE PORT O KOJEM SAM U PROSLOM BRANCH-U REKAO DA CU GA NAKNADNO OBJASNITI**

REKAO SAM DA JE `targetPort`, UPRAVO PORT SAME APLIKACIJE, KOJA RUNN-UJE U CONTAINERU, INSIDE POD

MOZDA SAM POGRESNO PROSLI PUT REKAO ALI OVO SLEDECE JE TACNO ZA `port`

ZATIM `port` JESTE, PORT ZA NODE PORT SERVICE

**A OVAJ GENERATED PORT JESTE PORT, NODA U KOJEM SE NALAZE I SERVICE I POD-OVI, ZA KOJE OVAJ SERVICE HANDLLE-UJE NETWORKING**

MOZEMO FGA NAZVATI `nodePort` PROSTO A BI GA RAZLIKOVALI IMENSKI OD `port` I `targetPort`

**I TAJ GENERATED PORT KORISTIM DA ACCESS-UJEMO SERVICE FROM OUTSIDE OF OUR CLUSTER**

UGLAVNOM TO JE BROJ KOJI JE AROUND 30000

SADA CU DA RUNN-UJE I describe KOMANDU

- `k describe service posts-srv`

```zsh
Name:                     posts-srv
Namespace:                default
Labels:                   <none>
Annotations:              <none>
Selector:                 app=posts
Type:                     NodePort
IP Families:              <none>
IP:                       10.105.230.95
IPs:                      10.105.230.95
Port:                     posts  4000/TCP
TargetPort:               4000/TCP
NodePort:                 posts  31181/TCP
Endpoints:                172.17.0.2:4000
Session Affinity:         None
External Traffic Policy:  Cluster
Events:                   <none>

```
