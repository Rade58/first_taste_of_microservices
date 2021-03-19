# CREATING A POD

***

PRE KRIRNJA POD-A DA TI KAZM DA TVOJ CLUSTER MORA BITI STARTED, A TO SA `minipod` PROSTO RADIS OVAKO

- `minipod start`

MOZES DA URADI I OVO

- `eval $(minikube docker-env)` (NISAM SIGURAN ALI MISLIM DA OVO TREBA ZA SVAKI OTVOREN NOVI TERMINAL) (**ALI MISLIM DA OVO NISTA NE RADDI**)

***

SADA CU KREIATI CONFIG FILE, SA KOJIM CU KRIRATI POD DIREKTNO

OD MOG POST SERVICE-A, STO ZNACI DA CU PRVO NAPRAVITI IMAGE ZA POSTS

- `cd posts`

- `docker build -t radebajic/posts:0.0.1 .`
  
- `docker images`

```c
REPOSITORY                    TAG              IMAGE ID       CREATED        SIZE
radebajic/posts               0.0.1            8d6f9ce5d76b   1 minute ago   125MB
node                          lts-alpine3.12   8f86419010df   7 days ago     117MB
gcr.io/k8s-minikube/kicbase   v0.0.18          a776c544501a   3 weeks ago    1.08GB
```
