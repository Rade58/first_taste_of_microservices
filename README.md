# INTRODUCING DEPLOYMENTS IN KUBERNETES CLUSTER

RANIJE SAM JA KREIRAO POD I STAVLJAO GA U CUBERNETES CUSTER

ALI TO SE OBICNO NE RADI

OBICNO SE NE PRAVE PODS NA NACIN KAKO SAM JA OVDE DEFINISAO

- `cat infra/k8s/posts.yaml`

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: posts
spec:
  containers:
    - name: posts
      image: radebajic/posts:0.0.1
```
