# COMMON `kubectl` COMMANDS

***
***
***
***

NIJE TEMA, ALI AJDE DA OBNOVIM PRVO NEKE DOCKER KOMANDE, CISTO U CILJU DA IH OLJE NAUCIM

- `docker build -t <image name you pick> .`
- `docker run <image id or image tag>`
- `docker run -it <image id or name> <startup command override>`
- `docker ps`
- `docker exec -it <container id> <startup command override>`
- `docker logs <container id>` 

***
***
***
***

**SADA DA TI PREDSTAVIM NEKE KUBERNETES COMMANDS**

- `kubectl get pods` JE EKVIVALENT DOCKEROVOM `docker ps`

- `kubectl exec -it <pod name> <startup command override>`

ZNAS I SAM CIJI BI GORNJI EKVIVALENT BIO U PURE DOCKER WORLDU

I OVA KOMANDA

- `kubectl logs <pod name>` JE EKVIVALENT `docker logs <container id>`

**UKLANJANJE PODA:**

- `kubectl delete pod <pod name>`

**KREIRANJE OBJEKTA (POD-A)**

- `kubectl apply -f <config file name>`

OPIS CELOG LIFECYCLE-A POD-A

- `kubectl describe pod <pod name>`
