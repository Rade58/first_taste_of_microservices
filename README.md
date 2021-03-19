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

```yaml

```


