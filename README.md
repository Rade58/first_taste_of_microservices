# CLUSTER IP SERVICE SETUP

SADA IMAM DVA DEPLOYMENTA

- `k get deployments`

```zsh
NAME             READY   UP-TO-DATE   AVAILABLE   AGE
event-bus-depl   1/1     1            1           35m
posts-depl       1/1     1            1           18h
```

IMAM I DVA POD-A, PO POD U JEDNOM I U DRUGOM DEPLOYMENTU

- `k get pods`

```zsh
NAME                             READY   STATUS    RESTARTS   AGE
event-bus-depl-74759d587-r7dwx   1/1     Running   0          35m
posts-depl-55b9986456-g2gg4      1/1     Running   1          17h
```

# NAIME, TEBI CE TREBATI CLIUSTER IP SERVICE, ZA JEDAN POD, ALI I JEDAN ZA DRUGI POD

JER KOMUNIKACIJA, ODNOSNO TRAFFIC IDE SA JEDNOG PODA, DO CLUSTER IP-JA DRUGOG PODA, I TRAFFIC NA KRAJ STIGNE DO TOG DRUGOG PODA

U MOM SLUCAJU TO ZNACI DA CU MORATI KREIRATI CLUSTER IP ZA posts I DA CU MORATI KREIRATI CLUSTER IP ZA event_bus
