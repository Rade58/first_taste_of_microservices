# COMMON COMMANDS AROUND DEPLOYMENT

NEKE SAM VEC PROBAO RANIJE PO NEKOJ LOGICI JER ZNAM DA POSTOOJE TRI VRSTE OBJEKATA: `pods` `deployments` `services`

ZATO U KOMANDAMA FIGURISU `pods` `deployments` `services` `pod` `deployment` `service`

I GORNJI WORD-OVI PREDSTAVLJAJU STVARI KOJE SE CHANG-UJU U KOMANDAMA, U ZAVISNOSTI SA KOJIM OBJEKTIMA TI TRENUTNO RADIS ILI MANIPULISES

BICE TI ODMAH JASNO KADA UPOTREBIM NEKE OD NJIH

**OPET TI NAPOMINJEM DA JE `k` MOJ ALIAS KOJI SAM NAPRAVIO, DA NE BI KUCAO `kubectl` STAALNO KADA RUNN-UJEM KUBERNETES COMMANDS**

## LISTING ALL RUNNING DEPLOYMENTS INSIDE OUR CLUSTER

- `k get deployments`

```zsh
NAME         READY   UP-TO-DATE   AVAILABLE   AGE
posts-depl   1/1     1            1           16h
```

**READY** PREDSTAVLJA BROJ POD-OVA KOJE DEPLOYMENT KREIRA (IMAS UKUPAN BROJ I BROJ RUNNING PODS (TI IMAS SAD RUNNING JEDAN POD OD UKUPNO JEDNOG POD-A))

**UP TO DATE** JE BROJ UP TO DATE PODOVA

SAD CU DA LIST-UJEM I POD-OVE

- `k get pods`

```zsh
NAME                         READY   STATUS    RESTARTS   AGE
posts-depl-d955f9b4b-lbqqr   1/1     Running   2          16h
```

**REKAO SAM TI DA DEPLOYMENT BRINE O SVOJIM GENERATED PODS, I AKO ONI MIISTERIOZNO NESTANU, TADA CE DEPLOYMENT POKUSATI DA NAPRAVI ISTI TAKAV POD**

SADA CU DA POKUSAM DA GA UKLONIM

- `k delete pod posts-depl-d955f9b4b-lbqqr`

```zsh
pod "posts-depl-d955f9b4b-lbqqr" deleted
```

**ODMAH CES VIDETI DA JE DEPLOYMENT REKREIRAO ISTI POD**

- `k get pods`

```zsh
NAME                         READY   STATUS    RESTARTS   AGE
posts-depl-d955f9b4b-5c5qq   1/1     Running   0          63s
```

DAKLE NAPRAVLJEN JE ISTI POD SAMO IMA DRUGO GENERATED IME

I TO JE SAMO ZADNJI DEO IMENA RAZLICIT `5c5qq`

ISTO TAKO VIDIS DA JE ONAJ UKLONJENI POD BIO STAR 16 SATI, DOK JE OVAJ NOVI STAAR SAMO 63 SEKUNDE

**OVO SVE JE SJAJNO, JER KAKO VIDIS, AKO NESTO KRENE PO ZLU (NPODS NESTAJU), KUBERNETIS HAS OUR BACK, AUTOMATSKI CE POKUSATI DA REPAIR-UJE NASU APLIKACIJU**

# DESCRIBING DEPLOYMMENT

- `k describe deployment posts-depl`

```zsh
Name:                   posts-depl
Namespace:              default
CreationTimestamp:      Fri, 19 Mar 2021 22:23:29 +0100
Labels:                 <none>
Annotations:            deployment.kubernetes.io/revision: 1
Selector:               app=posts
Replicas:               1 desired | 1 updated | 1 total | 1 available | 0 unavailable
StrategyType:           RollingUpdate
MinReadySeconds:        0
RollingUpdateStrategy:  25% max unavailable, 25% max surge
Pod Template:
  Labels:  app=posts
  Containers:
   posts:
    Image:        radebajic/posts:0.0.1
    Port:         <none>
    Host Port:    <none>
    Environment:  <none>
    Mounts:       <none>
  Volumes:        <none>
Conditions:
  Type           Status  Reason
  ----           ------  ------
  Progressing    True    NewReplicaSetAvailable
  Available      True    MinimumReplicasAvailable
OldReplicaSets:  <none>
NewReplicaSet:   posts-depl-d955f9b4b (1/1 replicas created)
Events:
  Type    Reason             Age   From                   Message
  ----    ------             ----  ----                   -------
  Normal  ScalingReplicaSet  16h   deployment-controller  Scaled up replica set posts-depl-d955f9b4b to 1
```

