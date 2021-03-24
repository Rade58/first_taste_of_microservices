# INTRODUCING Skaffold

MAKING CHANGES TO OUR CODE, JESTE KAKO SI VIDEO POMALO PAINFULL

PRVO MORAMO BUILD-OVATI KONFIGURACIJU ZA DEPLOYMENT OBJECT, KOJA MORA IMATI 'latest' TAG U DELU ZA PODS SPECIFICATION (BICE IMPLIED AKO NE STAVIS :latest)

**ZATIM RADIS DEVELOPMENT, ODNOSNO EDITUJES, ODNOSNO UPDATE-UJES SVOJ CODE**

NAKON TOGA MORAS DA BUILD-UJES IMAGE I DA GA PUSH-UJES TO DOCKER HUB

AKO PRVI PUT ZELS DA APPLY-UJES DEPLOYMENT NA SVOJ CLUSTER, ONDA RUNN-UJES `kubectl apply -f <yaml file name>` KOMANDU

A K OJE REC O UPDATDE-U, ONDA RUNN-UJES KOMANDU `kubectl rollout restart deployment <depl name>`

## OVAJ PROCES, KOJI SI OBVLJA SVAAKI PUT, JESTE KINDE PAINFULL, ALI DOBRO JE STO SI GA RADIO, JER SAMO TAKO SI SVE MOGAO RAZUMETI

POGOTOVO KADA BUDES CODE DEPLOY-OVAO U PRODUCTION BASED ENVIROMENTU, DOBRO JE ZA TEBE DA SVE TO RAZUMES

**MEDJUTIM U DEVELOPMENT ENNVIROMENT-U OVO I NIJE DOBAR APPROACH**

# ZATO JA ZELIM DA KORISTIM TOOL NAMED `Skaffold` KADA DEVELOP-UJEM U KUBERNETES-U

SKAFFOLD JE COMMAND LINE TOOL KOJI CU KORISTITI DA **SE AUTOMATE-UJU MNOGI TASKS U KUBERNETES DEV ENVIROMENT-U**

OVO SU NJEGOVE DOBRE STVARI:

- CINI VEOMA LAKIM DA SE UPDATE-UJE CODE U RUNNING POD-U (TOLIKO JE BRZO CAK I KAO DA NE KORISTIM KUBERNETES)

- CINI VEOMA LAKIM CREATING/DELETING ALL OBJECTS, KOJI SU TIED TO A PROJECT (MOZE SE RADITI VISE OBJECT-A AT ONCE), I OVO POSTAJE VEOMA VAZNO KADA BUDES RADIO BETWEEN MULTIPLE KUBERNETES PROJECTS

KADA RUNN-UJES CLUSTER NA TVOJOJ MACHINE-I TO JE SAMO JEDAN CLUSTER

JER AKO SUTRA BUDES RADIO NA DRUGOM PROJECT-U ILI ORODUCTION APP-U, ZELIS DA BUDES U MOGUCNOSTI DA CHANGE-UJES BETWEEN DIFFFERENT SETS OF OBJECTS, VEOMA BRZO; A SA SKAFFOLDOM TO MOZES RADITI VEOMA BRZO

## INSTALIRACU GA

<https://skaffold.dev/>

OBJASNJENOTI JE SVE U SUSTINI RUNN-UJES SAMO DVE KOMANDE DA BI GA INSTALIRAO ZA LINU

DA BI TESTIRAO DA TI JE INSTALIRAN SAMO CU RUNN-OVATI U TERMINALU SLEDECE

- `skaffold`

IMACES ODMAH BUNCH OF HELPFUL INFORMATIONS

```zsh
A tool that facilitates continuous development for Kubernetes applications.

  Find more information at: https://skaffold.dev/docs/getting-started/

End-to-end pipelines:
  run               Run a pipeline
  dev               Run a pipeline in development mode
  debug             [beta] Run a pipeline in debug mode

Pipeline building blocks for CI/CD:
  build             Build the artifacts
  test              Run tests against your built application images
  deploy            Deploy pre-built artifacts
  delete            Delete the deployed application
  render            [alpha] Perform all image builds, and output rendered Kubernetes manifests
  apply             Apply hydrated manifests to a cluster

Getting started with a new project:
  init              [alpha] Generate configuration for deploying an application
  fix               Update old configuration to a newer schema version

Other Commands:
  completion        Output shell completion for the given shell (bash or zsh)
  config            Interact with the Skaffold configuration
  credits           Export third party notices to given path (./skaffold-credits by default)
  diagnose          Run a diagnostic on Skaffold
  schema            List and print json schemas used to validate skaffold.yaml configuration
  survey            Opens a web browser to fill out the Skaffold survey
  version           Print the version information

Usage:
  skaffold [flags] [options]

Use "skaffold <command> --help" for more information about a given command.
Use "skaffold options" for a list of global command-line options (applies to all commands).
```

# CONFIGURING SKAFFOLD

<https://skaffold.dev/docs/design/config/>

PISACU CONFIG FILE, KOJI CE RECI SKAFFOLD-U **KAKO DA MANGE-UJE ALL DIFFERENT SUBPROJECTS U NASEM CLUSTER-U**

U ROOT-U PROJECT-A KREIRAM OVAJ FILE

I U NJEMU CU PISATI SLICNU KONFIGURACIJU KAO STO SAM RANIJE PISAO A NAS KUBERNETES CLUSTER, SMO STO SE OVDE NECE NISTA APPLY-OVATI NA KUBERNETES VEC NA SKAFFOLD DIRECTORY

- `touch skaffold.yaml`

**TO ZNACI DA JE SKAFFOLD TOOL KOJI RUNN-UJE OUTSIDE OF OURR CLUSTER**

OVAJ NAPISAN FILE JE STVAR KOJA SE PISE SAMO JEDNOM PA SE TAKO RECI KOPIRA I PAST-UJE, JER JE SLICAN OD PROJEKTA DO PROJEKTA

```yaml
apiVersion: skaffold/v2beta13
kind: Config
deploy:
  kubectl:
    manifests:
      - ./infra/k8s/*
build:
  local:
    push: false
  artifacts:
    - image: radebajic/client
      context: client
      docker:
        dockerfile: Dockerfile
      sync:
        manual:
          - src: 'src/**/*.{ts,js,jsx,tsx}'
            dest: .

```

AKO VIDIS GORNJI `kubectl` DEO, TO JE FIRST IMPORTANT THING OF THE CONFIG; TU JE SPECIFIED DA POSTOJI COLLECTION RAZLICITIH CONFIG FILE-OVA, KOJI SU INTENDED ZA KUBERNETES

**TIME SMO REKLI SKFFOLD-U DA TREBA DA WATCH-UJE SVE YAML FILES INSIDE FOLDER: `infra/k8s`**

BILO KADA NAPRAVIMO PROMENU U NEKOM OD TIH FAILE-OVA, SKAFFOLD CE AUTOMATSKI REAPPLY-OVATI TAJ CONFIG FILE U NAS KUBERNETES CLUSTER; DRUGIM RECIMA SPASICE ME OD RUNNINGA `kubectl apply -f` KOMANDE, SVAKI PUT KADA KREIRAMO YAML FILE ILI NAPRAVIMO PROMENU U YAML FILE-U

**ISTO TAKO SVAKI PUT KADA START-UJES SKAFFOLD, POMENUTI CONFIG-OVI CE SE REAPPLY-OVATI**

**ISTO TAKO KADA ZAUSTAVIS SKAFFOLD, SVI OBJEKTI KOJI SU KREIRANI BY CONFIGURATIONS, BICE DELETED**

U SUSTINI TAJ DEO CONFIGA SKAFFOLDA CE URADITI TRI STVARI

- WE STARTUP SKAFFOLD, APPLY-UJEMO POMENUTE DILE-OVE NA CLUSTER
- KADA NAPRAVIMO PROMENU .APPLY-OVACE SE TI YAML FILE-OVI 
- KADA ZUSTAVIMO SKAFFOLD, BIE PRONADJENI KUBER. OBJEKTI RELATED TO SKAFFOLD I BICE DELETED

DAKLE BICE OMOGUCENO VEOMA LAKO PRELAZENJE SA PROJEKAT NA PROJEKAT

U build DELU DISABLED JE PUSHING IMAGE-A TO DOCKERHUB, JER TO MI NIJE REQUIRED KADA ZELIM DA KORISTIM SKAFFOLD, I ZATO SAM TO DISABLE-VAO

**STA ZNACI ONO STO SAM DEFINISAO UNDER `artifcts` ?**

artifacts SECTION GOVORI SKAFFOLD-U O NECEMU INSIDE PROJECT DA TREBA MAINTAIN-OVATI

`GOVORIMO SKAFFOLDU DA POSTOJI JEDAN pod KOJI CE RUNN-OVATI CODE IZS NJEGOVOG client DIREKTORIJUMA`

KADA SE GOD NESTO PROMENI U `client` DIREKTORIJUMU, SCAFOLD CE POKUSATI DA TAKE-UJE THOSE CHANGES I NEKAKO UPDATE-UJE OUR POD

PA AKO POKUSAS DA PROMENIS NA PRIMER tsx FILE, SKAFFOLD CE POKUSATI DA TAKE-UJE THAT CHANGES I DIREKTNO IH THROW-UJE INSIDE POD

**DAKLE TIME CE NAS POD (POD NASE REACT APLIKACIJE) IMATI LATEST CODE INSIDE OF IT**

ALI KAO PROMENIS BILO STA U client DIRECTORIJU, A NE NALZI SE INSIDE src; UMESTO TOGA CE SKAFFOLD POKUSATI DA IGRADI ENTIRE IMAGE

AKO NA PRIMER INSTALIRAS NEW DEPENDANCI INTO CLIENT PROJECT, TO CE MENJATI package.json I TEHNICKI I package.lock I node_modules DIREKTORIJUM (DAKLE DRUGA PROMENA U PROJEKTU KOJA SE NE ODNOSI NA NASE REACT KOMPONENTE); **DAKLE TADA CE SKAFFOLD DECIDE-OVATI DA REBULD-UJE ENTIRE IMAGE ZA REACT APP , `ALI TAKODJE CE UPDATE-OVATI RELATED DEPLOYMENT`**

ALI JA ZELI MTAJ RULE I ZA DRUGE POD-OVE, ODNOSNO I ZA PODOVE DRUGIH MICROSERVICES

- `code skaffold.yaml`

TU MORAS DA ZADAAS DRUGACIJE PRAVILO ZA `src` JER U EXPRESS SERVER PROJEKTU IMAS SAMO index.js FILE

```yaml
apiVersion: skaffold/v2beta13
kind: Config
deploy:
  kubectl:
    manifests:
      - ./infra/k8s/*
build:
  local:
    push: false
  artifacts:
    - image: radebajic/client
      context: client
      docker:
        dockerfile: Dockerfile
      sync:
        manual:
          - src: 'src/**/*.{ts,js,jsx,tsx}'
            dest: .
    - image: radebajic/posts
      context: posts
      docker:
        dockerfile: Dockerfile
      sync:
        manual:
          - src: '*.js'
            dest: .
    - image: radebajic/comments
      context: comments
      docker:
        dockerfile: Dockerfile
      sync:
        manual:
          - src: '*.js'
            dest: .
    - image: radebajic/moderation
      context: moderation
      docker:
        dockerfile: Dockerfile
      sync:
        manual:
          - src: '*.js'
            dest: .
    - image: radebajic/query
      context: query
      docker:
        dockerfile: Dockerfile
      sync:
        manual:
          - src: '*.js'
            dest: .
    - image: radebajic/event_bus
      context: event_bus
      docker:
        dockerfile: Dockerfile
      sync:
        manual:
          - src: '*.js'
            dest: .
```
