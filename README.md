# COMMON `kubectl` COMMANDS

***
***
***
***

NIJE TEMA, ALI AJDE DA OBNOVIM PRVO NEKE DOCKER KOMANDE, CISTO U CILJU DA IH OLJE NAUCIM

**DOCKER JE TAJ KOJI SE IN GENERAL BAVI RUNNING-OM INDIVIDUAL CONTAINER-A**

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

**A KUBERNATES JE ALL ABOUT RUNNING CONTAINER TOGETHER**

**SADA DA TI PREDSTAVIM NEKE KUBERNETES COMMANDS**

- `kubectl get pods` JE EKVIVALENT DOCKEROVOM `docker ps`

- `kubectl exec -it <pod name> <startup command override>`

ZNAS I SAM CIJI BI GORNJI EKVIVALENT BIO U PURE DOCKER WORLDU

I OVA KOMANDA

- `kubectl logs <pod name>` JE EKVIVALENT `docker logs <container id>`

**UKLANJANJE PODA:**

- `kubectl delete pod <pod name>`

**KREIRANJE OBJEKTA (POD-A, DEPLOYMENTA ILI SERVICE-A) ODNOSNO PROCESSING CONFIG FILE-A**

- `kubectl apply -f <config file name>`

PRINTING INFORMACIJA IZ RUNNING POD-A

- `kubectl describe pod <pod name>`

# POKRENI OPET `minikube` AKO TI JE UGASEN

- `minikube start`

DA VIDIM KOJI SU MI RUNNING PODS

- `kubectl get pods`

```c
NAME    READY   STATUS    RESTARTS   AGE
posts   1/1     Running   1          6h37m

```

# POKRENI PONOVO PROCESSING ISTOG ONOG CONFIG FILE-A

- `cd infra/k8s`

- `kubectl apply -f posts.yaml`

```bash
pod/posts unchanged
```

- `kubectl get pods`

```c
NAME    READY   STATUS    RESTARTS   AGE
posts   1/1     Running   1          6h45m
```

# SADA CU DA EXECUTE-UJEM COMMAND INSIDE RUNNING POD

- `kubectl exec -it posts sh`

ODNOSNO OTVARAM SHELL INSIDE RUNNING CONTAINER

```sh
kubectl exec [POD] [COMMAND] is DEPRECATED and will be removed in a future version. Use kubectl exec [POD] -- [COMMAND] instead.
/app # ls
Dockerfile         index.js           node_modules       package-lock.json  package.json       yarn.lock
/app # 

```

**AKO BUDES RUNN-OVAO MULTIPLE CONTAINER IN SAME POD, SA OVOM KOMANDOM BICES PROMPTED DA BIRAS CONTAINER**

```
/app # exit

```

IZASAO SAM I CONTAINER SHELL-A

# UZECU SADA LOGS FROM MY ONLY POD RIGHT NOW

- `kubectl logs posts`

```shell
> posts@1.0.0 start /app
> npx nodemon index.js

[nodemon] 2.0.7
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node index.js`
listening on: http://localhost:4000
```

STO ZNACI DA U MOM CONTAINER-U, INSIDE POD, RUNN-UJE MOJ NODE APP

TO VIDIS FROM THE LOGS

# DELETING PODA, MANUALLY

NAJCESCI RAZLOG KADA RADIS OVO JE KADA ZELIS MANUELNO DA RESTART-UJES POD

UKLONICU POD

- `kubectl delete pod posts`

TREBACE MU MALO VREMENA DA GA UKLONI

10 SEKUNDI

```c
pod "posts" deleted
```

- `kubectl get pods`

```c
No resources found in default namespace.
```

# RKREIRACU POD QUICKLY

NEMOJ DA BRINES ZA IMAGE, ON JE I DALJE U REGISTRY-JU

- `cd infra/k8s`

- `kubectl apply -f posts.yaml`

```c
pod/posts created
```

- `kubectl get pods`

```shell
NAME    READY   STATUS    RESTARTS   AGE
posts   1/1     Running   0          68s
```

# PRINTING INFORMATION O SAMOM POD-U

- `kubectl describe pod posts`

DACE TI NEKI DEBUG INFO IF YOU FEEL THAT SOMETHING IS WRONG WITH THE POD

```sh
Name:         posts
Namespace:    default
Priority:     0
Node:         minikube/192.168.49.2
Start Time:   Fri, 19 Mar 2021 20:47:12 +0100
Labels:       <none>
Annotations:  <none>
Status:       Running
IP:           172.17.0.2
IPs:
  IP:  172.17.0.2
Containers:
  posts:
    Container ID:   docker://f3628e2bbcd7ee7f637bc876aff16f6e0f4288e7f9ac7c9b10e6e3c135075c32
    Image:          radebajic/posts:0.0.1
    Image ID:       docker://sha256:8d6f9ce5d76b571b66baf837191761c341727f6b041935958936aeb5bed130f1
    Port:           <none>
    Host Port:      <none>
    State:          Running
      Started:      Fri, 19 Mar 2021 20:47:19 +0100
    Ready:          True
    Restart Count:  0
    Environment:    <none>
    Mounts:
      /var/run/secrets/kubernetes.io/serviceaccount from default-token-b5658 (ro)
Conditions:
  Type              Status
  Initialized       True 
  Ready             True 
  ContainersReady   True 
  PodScheduled      True 
Volumes:
  default-token-b5658:
    Type:        Secret (a volume populated by a Secret)
    SecretName:  default-token-b5658
    Optional:    false
QoS Class:       BestEffort
Node-Selectors:  <none>
Tolerations:     node.kubernetes.io/not-ready:NoExecute op=Exists for 300s
                 node.kubernetes.io/unreachable:NoExecute op=Exists for 300s
Events:
  Type    Reason     Age    From               Message
  ----    ------     ----   ----               -------
  Normal  Scheduled  8m31s  default-scheduler  Successfully assigned default/posts to minikube
  Normal  Pulled     8m26s  kubelet            Container image "radebajic/posts:0.0.1" already present on machine
  Normal  Created    8m25s  kubelet            Created container posts
  Normal  Started    8m24s  kubelet            Started container posts

```

NJVAZNIJE JE OVAJ INFO PRI DNU: `Events`

TO JE EVENT LOGS

I TO TI MOZE DATI SOME DEBUG INFORMATION

