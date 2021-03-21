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
