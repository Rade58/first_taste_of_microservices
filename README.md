# LOAD BALANCER AND `Ingress`

LOAD BALANCER JE KOMPLEKSAN

MORAM DA RAZDVOJIM NEKE STVARI U VIDU TERMINOLOGIJE, POGOTOVO AKO IMAM U VIDU TO DA SVASTA PISE ONLINE O LOAD BALANCERIMA

JA MORAM USTVARI RAZDVOJITI NEKE STVARI KOJE SE TICU KUBERNETES WORLD-A I LOAD BALANCERA

# STA JE `LOAD BLANCER SERVICE`?

LOAD BALANCER SERVICE

GOVORI KUBERNETES-U TO REACH OUT TO ITS PROVIDER (RECI CU UBRZO STA JE PROVIDER) I PROVISION-UJE LAOD BALANCER-A

GOAL MU JE DA GET-UJE TRAFFIC INTO SINGLE POD

# NESTO STO JE CLOSELY RELATED JESTE `Ingress` ILI `Ingress Controller`

***

digresija

Ingres I Ingress CONTROLER SU TEHNICKI DVE RAZLICITE STVARI ALI PODVESCU IH POD JEDNO; SAMO DOK BUDEM O NJIMA PRICAO U OVOM WORKSHOP-U

***

ZA RAZLIKU OD LOAD BALANCER SERVICE-A, INGRESS ILI INGRESS CONTROLER, JESTE POD, KOJI IMA SET OF ROUTING RULES; U CILJU DISTRIBUTIONA TRAFFICA DO DRUGIH SERVISA U NASEM CLUSTER-U

# LOAD BALANCER VIZUALIZACIJA

NA PRIMER, U BUDUCNOSTI IMACU MOJ CLUSTER, NA NEKOM OD PROVIDERA: AWS, GOOGLE CLOUD, AZURE ILI NESTO SLICNO

U TOM CLUSTERU POSMATRACU JEDAN POD

NASUPROT TOME SVEMU JA IMM OUTSIDE WORLD

**JA NEKAKO ZELIM DA GETUJEM TRAFFIC, ODNONO NETWORK REQUESTS IZ OUSIDE WORLD, DO TOG POD-A U MOM CLUSTERU**

KAKO TO URADITI KORICENJEM LOAD BALANCER-A?

**KREIRAO BI CONFIG FILE ZA `LOAD BALANCER SERVICE`** 

**FEED THAT CONFIG INTO MY CLUSTER, KORISCENJEM `kubectl apply -f` KOMANDE**

**LOAD BALANCER SERVICE JE ITS OWN SPECIAL THING**

DRUGI OBJEKTU KUBERNETES-A, O KOJIMA SAM DISKULTOVAO SU ZA RAZLIKU OD NJEGA, USTVARI STVARI KOJE SE KREIRAJU DIREKTNO U NASEM CLUSTERU

KREIRAO AM SERVICES, PODS, DEPLOYMRNTS INSIDE OF CLUSTER

`LOAD BALANCER SERVICE` CE RECI MOM CLUSTERU TO REACH-UJE OUT TO THE CLOUD PROVIDER DIREKTNO (DO AWS ILI GOOGLE CLOUD ILI AZURE) I PROVISION-OVACE SOME THING CALLED `LOAD BALANCER`

`LOAD BALANCER JE STVAR KOJA CE POSTOJATI OUTSIDE OF OUR CLUSTER, KAO PART OF AZURE ILI AWS ILI GOOGLE CLOUD PROVIDER-A`

**`TAJ LOAD BALANCER CE SLUZITI DA UZIMA TRAFFIC FROM THE OUTSIDE WORLD I DA GA DIRECT-UJE TO SOME POD INSIDE OF OUR CLUSTER`**

**CILJ LOAD BALLANCER SERVICE-A JE DAKLE DA KAZE NASEM CLUSTERU DA REACH-UJE OUT DO CLOUD PROVIDER-A, KOJI ONDA PROVISION-UJE LOAD BALANCER-A, SA GOAL-OM OF GETTING SOME TRAFFIC INTO A POD INSIDE OF OUR CLUSTER**

# LOAD BALANCER NIJE SUPER USEFUL ZA MOJ TRENUTNI SLUCAJ

TO KAZEM JER JA ZELIM DA DISTRIBUIRAM TRAFFICT TO THE SET OF DIFFERENT PODS

ZELIM DA IMAM ROUTING RULES TO DECIDE WHERE TO SEND THAT TRAFFIC TO

TO JE ZATO STO JA NE ZELI MDA SE MOJ REACT BROWSER APP OBRACA DIREKTNO NEKOM OD POD-OVA, VEC TOM SISTEMU ZA ROUTING RULES

**ZATO JA ZELIM DA KORISTIM `Ingress` ILI `Ingress Controler`**

A TO JE JEDAN POD KOJI TREBA DA IMA SET F ROUTING RULES TO DISTRIBUTE TRAFFIC TO OTHER SERVICES

I ON TREBA DA RADI PARALELN OSA LAOD BALANCER-OM

## STA INGRESS STVARNO RADI?

RECIMO DA IMAM SET OF DIFFERENRT PODS U MOM CLUSTERU NA NEKOM OD CLOUD PROVIDER-A, I NAPRAVIO SAM LOAD BALANCER SERVICE CONFIG FILE, KAKO BI MI CLOUD PROVIDER PROVISIN-OVAO LOAD BALANCER-A

REQUEST FROM THE OUTSIDE WORLD TREBA DA DOLAZI I DALJE DO LOAD BALANCERA FIRST

**ALI SADA CE LOAD BALANCER DA POSALJE REQUEST DO `INGRESS CONTROLERA`, KOJI CE IMATI SET OF ROUTING RULES INSIDE OF IT**
