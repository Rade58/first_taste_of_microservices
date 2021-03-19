# KUBERNETES SETUP

[SETTING UP mini-cube FOR LINUX](https://minikube.sigs.k8s.io/docs/start/)

>> minikube is local Kubernetes, focusing on making it easy to learn and develop for Kubernetes.
>> All you need is Docker (or similarly compatible) container or a Virtual Machine environment, and Kubernetes is a single command away: minikube start

POKUSACU DA INSTALIRAM IAKO AUTOR WORKSHOPA KAE DA JE OVO SVE SKLONO PROBLEMATICI (SAMO ZA LINUX ,A ZA MAC I WINDOWS JE EASY)

EVO NEKI KORACI KAKO SAM SVE INSTALIRAO

1. INSTALIRAO SAM ONDA [minicube](https://minikube.sigs.k8s.io/docs/start/)

PRATIO SAM TUTORIJAL

3. AUTOR WORKSHOPA KORISTI KOMADU `kubectl`

[INSTALIRAO SAM I TO](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/)

# PROVERIO SAM KOJU VERZIJU `kubectl`-A IMAM

- `kubectl version --client` ILI `kubectl version`

OVO JE BIO OUTOUT

```bash
Client Version: version.Info{Major:"1", Minor:"20", GitVersion:"v1.20.5", GitCommit:"6b1d87acf3c8253c123756b9e61dac642678305f", GitTreeState:"clean", BuildDate:"2021-03-18T01:10:43Z", GoVersion:"go1.15.8", Compiler:"gc", Platform:"linux/amd64"}
Server Version: version.Info{Major:"1", Minor:"20", GitVersion:"v1.20.2", GitCommit:"faecb196815e248d3ecfb03c680a4507229c2a56", GitTreeState:"clean", BuildDate:"2021-01-13T13:20:00Z", GoVersion:"go1.15.5", Compiler:"gc", Platform:"linux/amd64"}
```

# STARTOVACU minicube

- `minicube start`

USPESNO JE STARTED

MOZE BITI I STOPITRAN SA `stop`

# POSTOJI JEDNA MOZDA NEZELJNA STVAR, KOJU SAM SAZNAO U PROLAZU

A TO JE DA MORAM POOKRETATI OVO NAKON SVAKO OTVARNAJA TERMINALA

- `eval $(minikube docker-env)`

NE ZNAM STA JE OVO GORE, ALI ME I NE ZANIMA

USTVARI VEROVATNO TO VEZE DOCKER IMAAGE CACHE SA MINIKUBE REGISTRY-JEM

A NE ZNAM DA LI FUNKCIONISE

**VEROVATNO NE FUNKCIONISE**

NIJE NI BITNO

# JEDNA STVAR A KOJU MI NIKO NIJE REKAO, A TICE SE DODAVANJA DOCKER IMAGE-A U MINIKUBE REGISTRY

**KADA NAPRAVIS DOCKER IMAGE I AKO POKUSAS DA NAPRAVIS KUBERNETES POD, ODNOSNO MINICUBE POD, SA TIM DOCKER IMAGE-OM, TI NECES MOCI DA PULL-UJES TAJ IMAGE IZ DOCKER-OVOG IMAGE CACHE-A**

U SVIM GUIDE-OVIMA SE TO I NERADI, KOLIKOO SM  PROCITAO

JEDINI NACIN SA KOJIm SAM JA USPEO DA OVO POSTIGNEM, JESTE DA PRE CREAT-OVANJ POD-A, JA LOAD-UJEM TAJ IMAGE U MINIKUBE REGISTRY

KORIISTECI `cache add`

PRVO MOES PRONACI TACAN NAME IMAGE-A, TAKO STO CES IZLISTATI DOCKER IMAGE-OVE

- `docker images` (PUNO IME JE KOMBINACIJA `REPOSITORY` I `TAG` (GOVORIM TI O STVARIMA KOJE SU IZLISTANE OD TABELE DOBIJENE OVOM KOMANDOM))

```c
REPOSITORY                    TAG              IMAGE ID       CREATED        SIZE
radebajic/posts               0.0.1            8d6f9ce5d76b   17 hours ago   125MB
node                          lts-alpine3.12   8f86419010df   7 days ago     117MB
gcr.io/k8s-minikube/kicbase   v0.0.18          a776c544501a   3 weeks ago    1.08GB

```

E SAD MOZES DA OVAKO EXECUTE-UJES ADDING TO MINICUBE REGISTRY:
  `minikube cache add <docker image name>`

STO BI MOGAO OVAKO NAPISATI

- `minikube cache add radebajic/posts:0.0.1`

ISTO TAKO POSTOJ I `minicu=bve cache delete <docker image name>`

# ISTO TAKO MOGUCE JE RELOAD-OVATI PREVIOUS IMAGE

- `minicube cache reload <cached image>`
- 
DALJE SVE STO TE ZANIMA OKO TEME MINICUBE-OVOG IMAGE REGISTRY-JA MOZES PROCITATI [OVDE](https://minikube.sigs.k8s.io/docs/commands/cache/)

# MEDJUTIM ISTO TAKO OVO GORE POSTOJI I ODREDJENI DEPRECATION, ZA KOJI NECU MNOGO DA BRINEM, JER MISLIM DA NECU MNOGO KORISTITI MINICUBE; SAMO ZA UPOZNAVANJE SA KUBERNETES

MEDJUTIM RECENO JE DA CE cache add BITI DEPRECATED I DA JE BOLJE DA KORISTIS `image load`


# `image load`

OVO JE DAKLE NESTO STO CE ZAMENITI KOMANDE KKOJE MANGE-UJU IMAGEO,VE, ODNONO POMENUTE KOMANDE VEZANE ZA CAHE

- `minikube image load <name docker image-a>`
