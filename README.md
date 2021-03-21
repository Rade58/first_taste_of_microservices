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

# NEKI LJUDI VOLE DA KREIRAJ USEPARATE CONFIGURATION ZA CLUSTER IP; ALI JA NECU TO RADITI, VEC CU KONFIGURACIJU PISATI U DEPLOYMENT CONFIG FILE-OVIMA 

TO JE ZATO IT MAKES SENSE TO COLLOATE CLUSTER IP ZAJEDNO SA POD-OM

ODNOSN ODA JE BOLJE DA CLUSTER IP SERVICE BUDE VEZAN ZA POD/PODS KROZ KONFIGURACIJU

**OVO ZNACI DA CU PRAVITI MULTIPLE OBJECTS SA JEDNOM CONFIG-U, I MORACU ZATO NEKAO ODVOJITI KONFIGURACIJU DEPLOYMENTA, OD KONFIGURACIJE CLUSTER IP SERVICE-A**

TO SE RADI SA TRI CRTICE: `---`

# PRVO CU DA DEFINISEM CLUSTER IP SERVICE ZA PODS FOR event_bus

- `code infra/k8s/event-bus-depl.yaml`

KONFIGURACIJA CE BIT ISLICNA ONOJ KONFIGURACIJI `NODE PORT SERVICE`-A (FAJL `infra/k8s/posts-srv.yaml`)

I TU MORAM DA NAPRAVIM MANTCHING U ODNOSU NA LABEL I SELECTOR (GOVORIM O LABELU ZA PODS, KOJI SU U DEPLOYMENT DELU KONFIGURACIJE)

```yaml
# iznad ovoga je configuraacija deploymenta (necu je pokazivati ovde)
---
apiVersion: v1
kind: Service
metadata:
  name: event-bus-srv
spec:
  selector:
    app: event-bus
  type: ClusterIP
  ports:
    - name: event-bus
      protocol: TCP
      port: 4005
      targetPort: 4005
```

JA SAM SPECIFICIRAO TYPE, A DA NISI TO URADIO KUBERNETES BE DEFAULT-OVAO DO ClusterIP SERVICIRAO

PORT NA KOJEM JE EVENT BUSS APP, JESTE NA 4005 (targetPort), A port POD-A JE ISTI, IAKO SAM MOGAO STAVITI RAZLICIT, ALI NECU

ODMAH CU OVO POKUSATI DA APPLY-UJEM

- `cd infra/k8s`

- `kubectl apply -f event-bus-depl.yaml`

```zsh
deployment.apps/event-bus-depl unchanged
service/event-bus-srv created
```

VIDIS DA TI KAZE DA JE NOVI CLUSTER IP SERVICE KREIRAN

- `k get services`

```zsh
NAME            TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
event-bus-srv   ClusterIP   10.103.22.50    <none>        4005/TCP         77s
kubernetes      ClusterIP   10.96.0.1       <none>        443/TCP          2d5h
posts-srv       NodePort    10.105.230.95   <none>        4000:31181/TCP   3h2m
```

EVO GA I NA LISTI KUBERNETES SERVISA, KAKO MOZES VIDETI GORE


# SAD CU DA DEFINISEM CLUSTER IP SERVICE ZA PODS FOR posts

- `code infra/k8s/posts-depl.yaml`

```yaml
# iznad ovoga je configuraacija deploymenta (necu je pokazivati ovde)
---
apiVersion: v1
kind: Service
metadata:
  name: posts-srv
spec:
  selector:
    app: posts
  type: ClusterIP
  ports:
    - name: posts
      protocol: TCP
      port: 4000
      targetPort: 4000
```

- `cd infra/k8s`

- `kubectl apply -f posts-depl.yaml`

```zsh
deployment.apps/posts-depl unchanged
service/posts-srv configured
```

PRIMECUJES KAKO OVDE STOJI ZA SERVICE DA JE CONFIGURED, PREDPOSTAVLJAM DA SAM JA OVIM OVERRIDE-OVAO ONAJ `NODE PORT SERVICE` KOJI JE IMAO SVOJ FILE 

TAKO JE I ZATO TI GORE STOJI `configured`

TO JE ZATO STO SI KORISTIO ISTO IME KADA SI PRAVIO NODE PORT SERVICE

***
***

digresija:

NIJE VELIKA GRESKA, SAMO OVERRIDING, JA SAM ZATO PONOVO KREIRAO ONAJ `NODE PORT SERVICE`

NECE MI TREBATI N IZA STA ALI NEKA GIMAM, SAMO SAM MU PROMENIO IME (INDICIRAO SAM DA JE REC O DEVELOPMENTU JER SE TAJ SERVICE SAMO KORISTI ZA DEVELOPMENT) (PROMENIO SAM I IME FILE-A `infra/k8s/posts-dev-srv.yaml`)

***
***

DA SE SADA VRATIM NA TEMU

- `k get services`

```zsh
NAME            TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)    AGE
event-bus-srv   ClusterIP   10.103.22.50    <none>        4005/TCP   16m
kubernetes      ClusterIP   10.96.0.1       <none>        443/TCP    2d5h
posts-srv       ClusterIP   10.105.230.95   <none>        4000/TCP   3h17m
```





