# RUNNING SERVICES WITH DOCKER

ZA SADA KAKV JE MOJ APP, DEPLOYMENT BI OBAVIO TAKO STO BIH IZNAJMIO DIGITAL OCEAN ILI MOZDA AWS SERVER I TAMO KOPIRAO FILE-OVE, ZATIM START-OVAO, SVAKI SERVICE, KOJI BI RUNN-OVAO NA SVOMM PORT-U 

AKO BI NEKI OD SERVICE-A POSTAO OVERBURDENED, MORAO BIH GA MANELNO PLIT-OVATI INTO TWO SERVICE, ODNOSNO DODAO BI KOPIJU ISTOG SERVICE-A, RUNN-OVAO GA NA DRUGOM PORT-U

LOAD BALANCING U OVOM SLUCAJU OGLEDAO BI SE U RANDOMIZACIJI TOGA KOJI CE OD SERVISA BITI HITTED ,ODNONO RANDOMIZE-PVAO BI TO DO KOJEG OD NJIH CE STIVI INCOMMING REQUEST (DO JEDNOG ILI DO DRUGOG)

NEPOVOLJNE STVARI STO BIH MORAO ALLOCATE-OVATI NOVI PORT, ZA KOPIJU

MORAO BI DA U EVENT BUS-UDA SALJES IVENT-OVE I DO KOPIJE SERVISA, STO BI MORA D EKSPLICITNO SPECIFICIRAS, KAO I ZA OSTALE /events ENDPOINTE

NE BI VALJAALO DA COPUPLE-UJES BROJ SERVICE-A SA IMPLEMENTACIJOM EVENT BUS-A

EVENT BUS BI SAMO TREBALO DA ZNA DA ON SALJE EVENT, ODNOSNO NOTIFICATION PREMA SERVICE-U ,A NE DA ZNA DA LI TAJ SERVIS IMA KOPIJA ILI NE

ISTO TAKO AKO SVE SVOJE SERVICE-OVE RUNN-UJES U JEDNOM VIRTUAL MACHINE-U, TO JE OVERBURDENING

A STA AK OSU TI TI SERVISI KOJI SU COPIED RUNNED NA SEPARATE VIRTUAL MACHINE-U

PA JOS GORA STVAR ZA EVENT BUS, JER BI ONDA MORAO DA SPECIFICIRAS I IP TOG MACHINE-A KADA SALJES EVENTOVE PREM SERVISIMA
