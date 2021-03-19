# CREATING A DEPLOYMENT

PRVO CU UKLONITI ONAJ YAML CONFIG KOJI SAM KORISTIO ZA CREATING SINGLE POD-A U CLASTER-U

- `rm infra/k8s/posts.yaml`

A SACUVAO SAM GA OVDE CISTO A GA IMAM: `temp_trash/posts.yaml`

MOGAO BI I DA UKLONIM RUNNING POD

- `k get pods`

```zsh
NAME    READY   STATUS    RESTARTS   AGE
posts   1/1     Running   0          58m
```
- `k delete pods posts`
