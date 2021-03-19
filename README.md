# CREATING A DEPLOYMENT

PRVO CU UKLONITI ONAJ YAML CONFIG KOJI SAM KORISTIO ZA CREATING SINGLE POD-A U CLASTER-U

- `rm infra/k8s/posts.yaml`

A SACUVAO SAM GA OVDE CISTO A GA IMAM: `temp_trash/posts.yaml.old` (DODAO .old CISTO DA ZNAM DA SAM GA IZBACIO IZ UPOTREBE)

MOGAO BI I DA UKLONIM RUNNING POD

- `k get pods`

```zsh
NAME    READY   STATUS    RESTARTS   AGE
posts   1/1     Running   0          58m
```
- `k delete pods posts`

# KREIRACU FAJL `posts-depl.yaml`

- `touch infra/k8s/posts-depl.yaml`

SADA NE UZIMAM IZ BUCKETA OF OBJECTS `v1` VEC IZ `apps/v1` (DEPLOYMENT OBJECT JE IZ TOG BUCKET OF DIFFERENT OBJECTS, KOJI SE ZOVE `apps/v1`)

OPCIJA `replicas` DEFINISE KOLIKO PODS ZELIS DA KREIRAS, KOJI RUNN-UJU SOME PARTICULAR IMAGE

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: posts-depl
spec:
  replicas: 1
  selector:
    matchLabels:
      app: posts
  template:
    metadata:
      labels:
        app: posts
    spec:
      containers:
        - name: posts
          image: radebajic/posts:0.0.1

```

**ZELIM DA OBJASNIM `selector` I `template`**

`metadata` TEMPLATE-A I `selector` USTVRI WORK-UJU TOGETHER

**OVO MOZDA ZVUCI CREAZY, ALI DEPLOYMENT IMA HARRD TIMES OF FIGURING OUT OF WHICH PODS IT SHOULD MANAGE U NASEM CLUSTER-U**

AKO SE PODS KREIRAJU MORAS DATI INFORMACIJU DEPLOYMENT-U: "HEY THESE PODS OVER HERE ARE THE PODS YOU NEED TO MANAGE"

TO JE GOAL POMENUTOG selector AND metadata

`matchLabels` GOVORI "TAKE A LOOK AT EVRY PODS THA TARE CREATED, ALI NADJI PODS SA LABELOM app: posts"
`app` NEMA SPECIJALNI MEANING, JER MOZES PODESITI STA GOD HOCES

DAKLE GOVORIMO DEPLOYMENTU DA NADJE SVE PODS SA LABELOM app:posts

I NA TE PODS TREBA DA BUDE OVAJ DEPLOYMENT IN CHARGE

A U `template` TI SPECIFICIRAS TACNU KONFIGURACIJU POD-A, KOJE HOCES DA DEPOYMENT KREIRA

TU SI RKAO DA ZELIS DA POD IMA label SA VREDNOSCU app: posts

A UNDER spec SU SVE CONFIGURATION OPTIONS POD-A ,KOJE DEPLOYMENT TREBA DA MAKE-UJE

## OVO JE BARE BONES KONFIGURACIJA

POSTOJI JOS MNOGO OPCIJA KOJE SE MOGU PODESITI

# POKUSACU DA APPLY-UJEM OVO TO OUR CLUSTER

- `cd infra/k8s`

- `k apply -f posts-depl.yaml`

```zsh
deployment.apps/posts-depl created
```

- `k get deployments`

```zsh
NAME         READY   UP-TO-DATE   AVAILABLE   AGE
posts-depl   1/1     1            1           26s
```
