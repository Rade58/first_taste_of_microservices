# LOAD BALANCER SERVICES

***
***

**PRE NEGO STO OBJASNIM I UPOTREBIM LOAD BALANCER SERVICE, NAJBOLJE CE BITI DA PREDSTAVIM PROBLEME KOJE IMAM KOJE CE CE LOAD BALANCER RESITI**

***
***

digresija:

POSLEDNJA STVAR KOJU TREBAM DA URADIM U MOM PROJEKTU JESTE DA INTEGRATE-UJEM MOJU REACT APLIKACIJU INTO MY KUBERNETES CLUSTER

**OVO JE LAST BIG TOPIC, KOJIM CU SE BAVITI A KOJI SE TICE KUBERNETES-A**

***
***

JA SAM SADA URADIO DOSTA STVARI BY HAND, I TO JE MOZDA ANOYING I TEDIOUS, ALI KAKO DRUGACIJE DA NAUCIS NEGO DA RADIS BY HAND

**OVO SAM TI REKAO, JER CEMO KADA ZAVRSIOMO SA TRENUTNIM TOPICOM, MI USTVARI NAUCITI KAKO DA KORISTIMO TOOL, KOJI CE ZA NAS AUTOMATE-OVATI A LOT OF STUFF, AND MAKE OUTR LIVES A LITTLE BIT EASIER**

***
***

DA SE SADA POZBAVIM REACT APLIKACIJOM

# MOJA REACT APPLIKACIJA JE USTVARI `create-react-app` DEVELOPMENT SERVER; ODNONO TO JE ONO STO CU DOCKERIZOVATI I STAVITI U POD U MOM CLUSTERU

KREIRACU NOVI DOCKER IMAGE ZA MOJU REACT APLIKACIJU, ODNOSNO ZA DEVELOPMENT SERVER

ONDA CU KREIRATI CONTAINER INSIDE OF POD, I TO CU PLACEOVATI IN OUR CLUSTER

# DA CLERYFY-UJEMO STA RADI ONAJ REACT DEV SERVER

NAJVAZNIJA STVAR JE DA KADA KORISNIK OTVORI BROWSER I NAVIGATE-UJE DO MOJE APLIKACIJE; **ONO STO CE SE ATEMPT-OVATI, JESTE CONNECT TO MENTIONED REACT APP DEV SERVER**

**GOAL TOG DEV SERVERA JESTE DA UZME CODE KOJI SAM NAPISAO U REACT APP-U I DA OD NJEGA GENERISE `HTML` `JS` `CSS`**

KOD INITIAL NAVIGATION-A, JEDINA STVAR KOJU REACT DEV SERVER RADI JESTE RETURNING SOME HTML, JAVASCRIPT AND CSS

ONO STO TAJ DEV SERVER NE RADI JESTE MAKING ANY REQUESTS TO THE REST OF MICROSERVICES

JER ACTUAL REQUEST FOR DATA BICE ISSUED FROM THE USERS BROWSER

ONDA KADA SE DISI LODING CSS HTML, I ONDA JS-A, ONDA CE SE MAKEOVATI REQUEST FOR ALL POSTS I RELATED COMMENTS, TAK OSTO CE BITI HITTED QUERY MICROSERVICE

# DAKLE AFTER SERVING UP HTML, CSS AND JS (INITIAL STFF), REACT APP DEV SERVER VISE NIJE RELEVANTAN

TO TI KAZEM JER CE SVI REQUEST-OVI DOCI DALJE IZ BROWSER-A

A NE IZ REACT DEV SERVER-A

# KAKO CEMO OSIGURATI TO DA CE TAJ LOADED CODE IZ BROWSERA, MOCI PRAVITI REQUSTOVE DO SVIH ONIH DIFFERENT PODOVA, KOJI U SEBI IMAJU CONTAINERE KOJI HOLD-UJU NASE NodeJS MICROSERVICES

IMAM DVA MOGUCA NACIN; PRVI KOJI SE NE KORISTI U NI JEDNOJ OZBILJNOJ PRODUCTION APLIKACIJI; I DRUGI KOJI CU JA KORISTITI

ALI DA PRVO KAZEM KOJI JE TO PRVI NACIN

## 1. NACIN 1: PROBABLY NOT GOOD

DAKLE NE ZELIMO DA RADIMO OVO ALI JE MOGUCNOST

DEFINISANJE `NODE PORT SERVICE`-OVA ZA SVE OD PODS KOJE IMAM, OSIM ZA EVENT BUS

BAS KAO ONDA KADA SAM TESTIRAO, JER JA VEC IMAM ZA posts NAPRAVLJEN JEDAN `NODE POSTS SERVICE`; ALI I TADA SAM TI REKAO DA JE TO SAMO ZA TESTIRANJE TOKOM DEVELOPMENT-A

TO NE VALJA IZ NEKOLIKO RAZLOGA

JEDAN JE TO STO SE GENERISE RANDOM PORT

TO ZNACI DA KADA NA PRIMER REBUILD-UJES DEPLOYMENT, ZATIM CE SE PORT UNISTI, DA SE NAPRAVI ISTI TAKAV, I ONDA CE SE GENERISATI PONOVI DRUGACIJI PORT ZA NODE PORT SERVIS

VEROVATNO POSTOJI JOS RAZLOGA ZASTO OVO NE BI VALJALO

## 2. NACIN 2: PROBABLY GOOD WAY

KREIRACU `LOAD BALANCER SERVICE`

NJEGOV GOAL JE TO DA CU IMATI SINLE POINT OF ENTRY INTO OUR ENTIRE CLUSTER

ONDA CU OSIGURATI TO DA MOJA REACT APP (BROWSER PART) ACCESS THAT LOAD BALANCER SERVICE, U KOJI CU PLACEOVATI SOME LOGIC (ACTUAL CODE ILI CONFIGURATION) INSIDE OF LOAD BALANCER SERVICE

TAKO CE LOAD BALANCER TAKE-OVATI INCOMMING REQUEST I ROUTE THEM TO APPROPRIATE PODS; USTVARI ROUTE THEM TO THE RELATED CLUSTER IP SERVICE SVAKOG OD PODOV

REQUEST TREBA DA IDE PUTEM `browser` -> `load balancer service` -> `cluster ip service` -> `pod` (TAK OA SVAKI OD PODOVA)
