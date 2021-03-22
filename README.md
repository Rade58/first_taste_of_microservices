# INSTALLING `ingress-nginx`

OPEN SOURCE LIBRARY, KOJA CE DA KREIRA LOAD BLANCER SERVICE PLUS INGRESS

**JA CU DA KORISTIM OPEN SOURCE PROJECT KOJI SE ZOVE [`ingress-nginx`](https://github.com/kubernetes/ingress-nginx)** ([documentation](https://kubernetes.github.io/ingress-nginx/))

A POSTOJI I JEDAN PROJECT, KOJI IMA ALMOST IDENTIACL NAME I RADI ISTO, A TO JE `kubernetes-ingress`

**TO TO GOVORIM JESTE DA KADA CITAS DOKUMENTACIJU ILI BLOG POST, DA UVEK PROVERIS DA LI SE RADI O `ingress-nginx` ILI O `kubernetes-ingress`**

# INSTALLATION GUIDE

<https://kubernetes.github.io/ingress-nginx/deploy/#installation-guide>

ZA `minikube` INSTLACIJA JE JEDNOSTAVNA

SAM OSE EXECUTE-UJE KOMANDA

- `minikube addons enable ingress`

IMAO SAM INFO DA JE ADDON ENABLED NAKON EXECUTINGA GORNJE KOMANDE

## MEDJUTIM INTERESANTNO JE KAKO SE OVO INSTALIRA, ONDA KADA NE KORISTIS `minikube`

SLUCAJ KADA SI NA MAC-U, ILI KADA IMAS CLUTER NA CLOUD PROVIDER-U, TI ONDA RUNN-UJES ONU DOBRO POZNATU `kubectl apply -f` KOMANDU; SAMO ONO STO SE DODAJE, JESTE URL KOJI VODI DO `.yaml` FAJLA

MOZES OTVORITI NEKIH OD TIH URL-OVA U BROWSERU DA VIDIS STA PISE U TIM FAJLOVIMA

EVO JE KOMANDA ZA DIGITAL OCEAN

```zsh
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v0.44.0/deploy/static/provider/do/deploy.yaml
```

OTVORI TAJ URL U BROWSER-U

<https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v0.44.0/deploy/static/provider/do/deploy.yaml>

VIDECES OGROMAN YAML CONFIGURATION FILE

POMENUTI VELIKI FAJL CE IMATI RAZLICITE CONFIG SEKCIJE, A ONE CE KREIRATI MNOGE DRUGE OBJEKTE O KOJIMA NISAM NI GOVORIO

IZMEDJU STVARI KOJE TI NE ZNAS STA SU, NACI CES I CONFIG ZA DEPLOYMNT, GDE CE BITI IME nginx-ingress-controller, UPRAVO JE TO DEPLOYMENT VEZAN ZA TAJ POSEBAN POD KOJI CE BITI 'MIDDLE MAN' IZMEDJU LOAD BALANCER-A I CLUSTER IP SERVISA MOJIH POD-OVA U KOJIMA SU MOJI NODEJS MICROSERVICE-OVI

VIDECES NEGDE U FAJLU I CONFIGURACIJU ZA `LoadBalancer`, KOJEG DAKE PROVISION-UJE CLOUD PROVIDER




