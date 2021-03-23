# DEPLOYING THE REACT APP

MORAM SE PRVO PODSETITI STA SAM URADIO U PROSLOM BRANCH-U

DAKLE U PROSLOM BRANCH-U SAM NAPRAVIO CONFIG ZA `INGRESS CONTROLLER`

ON CE UCINITI DA KADA SALJEM REQUEST NA IP MOG CLUSTERA DA SE USTVARI ONDA REQUEST PROSLEDI DO CLUTER IP SERVICE-A OSTALIH POD-OVA GDE SU MOJE NODE MICROSERVICE APLIKACIJE (USTVARI ZA SADA JE TO SETT-OVANO SAMO za posts SERVICE ,EVO POGLEDAJ I SAM)

ODNOSNO ZA SADA SAMO KADA SE SALJE REQUEST PREMA `posts-srv` CLUSTER IP SERVISU, USTVARI REQUEST STIZE DO SAME NODE APLIKACIJE

- `cat infra/k8s/ingress-srv.yaml`

```yaml
apiVersion: networking.k8s.io/v1beta1
kind: Ingress
metadata:
  name: ingress-srv
  annotations:
    kubernetes.io/ingress.class: nginx
spec:
  rules:
    - host: myblog.com
      http:
        paths:
          - path: /posts
            backend:
              serviceName: posts-srv
              servicePort: 4000

```

**KAO STO VIDIS GORE, PODESIO SAM I TO DA OVAJ INGRESS CONTROLLER SAMO PRIHVATA REQUESTS SA DOMAIN-A `myblog.com`**

**A JOS VAZNIJA STVAR PODESIO SAM TAKORECI DA KADA SE REQUESTS SALJU NA, `myblog.com`, DA SE ONI USTVARI SALJU DO IP-JA MOG CLISTERA (EXECUTE `minicube ip` TO SEE IP)**

URADIO SAM TO MENJAJUCI hosts NA MOM RACUNARU

`cat /etc/hosts`

```bash
# iznad code me ne zanima, zato ga nisam prikazao

# for my kubernetes firts project
# tricking nginx to believe that minikube ip
# is myblog.com

192.168.49.2 myblog.com
```

***
***

**U SUTINI TI KADA SALJES REQUEST PREMA `myblog.com` USPESNO JE PREVAREN INGRESS CONTROLLER, ILI USPESNO JE PREVAREN VIRTUAL MACHINE, DA IPAK PRIHVATI TAJ REQUEST I PROSLEDI GA RELATED CLUSTE IP SERVISA**

AKO SE PITAS ZASTO SVE OVO POMENUTO, SAMO IZCITAJ PROSLI BRANCH, JER SAM TAM OSVE OBJASNIO

***
***

# STO SE TICE REACT APPLIKACIJE, PRVO CEMO DA IZMENIMO COD U KOJEM PRAVIM OREQUEST-OVE, KAKO BI ONI HITTOVALI `myblog.com`

