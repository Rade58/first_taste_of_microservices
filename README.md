# KUBERNETES SETUP

[SETTING UP mini-cube FOR LINUX](https://minikube.sigs.k8s.io/docs/start/)

>> minikube is local Kubernetes, focusing on making it easy to learn and develop for Kubernetes.
>> All you need is Docker (or similarly compatible) container or a Virtual Machine environment, and Kubernetes is a single command away: minikube start

POKUSACU DA INSTALIRAM IAKO AUTOR WORKSHOPA KAE DA JE OVO SVE SKLONO PROBLEMATICI (SAMO ZA LINUX ,A ZA MAC I WINDOWS JE EASY)

EVO NEKI KORACI KAKO SAM SVE INSTALIRAO

1. NE ZNAM DA LI MI JE TREBALO ALI SAM [INSTALIRAO PRVO VIRTUAL BOX](https://linuxhint.com/install-minikube-ubuntu/)

- `sudo apt-get update`
- `sudo apt-get install curl`
- `sudo apt-get install virtualbox virtualbox-ext-pack`

2. INSTALIRAO SAM ONDA [minicube](https://minikube.sigs.k8s.io/docs/start/)

PRATIO SAM TUTORIJAL

3. AUTOR WORKSHOPA KORISTI KOMADU `kubectl`

[INSTALIRAO SAM I TO](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/)

# PROVERIO SAM KOJU VERZIJU `kubectl`-A IMAM

- `kubectl version --client`

OVO JE BIO OUTOUT

```bash
Client Version: version.Info{Major:"1", Minor:"20", GitVersion:"v1.20.4", GitCommit:"e87da0bd6e03ec3fea7933c4b5263d151aafd07c", GitTreeState:"clean", BuildDate:"2021-02-18T16:12:00Z", GoVersion:"go1.15.8", Compiler:"gc", Platform:"linux/amd64"}
```

**JA NE ZNAM DA LI SAM MORAO SVE OVO STO SAM INSTALIRAO, USVRARI INSTALIRATI, ALI IPAK JESAM, I TO JE TO**

