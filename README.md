# UPDATING DEPLOYMENTS

REKAO SAM TI JEDNOM RANIJE, DA **MI KORISTIMO DEPLOYMENTS, JER MOZEMO VEOMA LAKO DA UPDATE-UJEM VERSION IMAGE-A ZA, KOJE KORISTE SVAKI OD OUR PODS**

TO ZNACI DA AKO NA PRIMER NAPRAVIS PROMENU U posts PROJEKTU **I REBUILD-UJES IMAGE** (VAZNO JE DA SE REBUILD-UJE (SAMO NAPOMINJEM)) POSLE TOGA, MOZDA CES **ZELETI DA REDEPLOY-OVATI APLIKACIJU KAKO BI SE RUNN-OVALA DRUGA VERZIJU IMAGE-A INSTEAD (USTVARI KAKO BI PODS ILI POD RUNN-OVAAO DRUGU VERZIJU TOG IMAGE (IL IDA SE IZRAZIM TACNIJE, KAKO BI SE CONTAINER/I INSTATICIZIRAO/LI OD NOVE VERZIJE IMAGE-A))**

# POSTOJE DVA NACINA DAA SE UPDATE-UJE IMAGE

JEDAN OD METODA, ZA KOJI CU TI RECI NE KORISTI SE MUCH OFFTEN, ZATO CU TI TO PRVO POKAZATI

# METHOD ONE

KORACI SE SASTOJE OD:

1. MAKING-U CHANGE- TO YOUR PROJECT CODE

2. ZATIM REBUILD-UJES DOCKER IMAGE, SA SPECIFICIRANOM NOVOM VERZIJOM IMAGE-A

3. ONDA EDIT-UJES DEPLOYMENT-OV CONFIG YAML FILE, GDE BI SPECIFICIRAO NOVU VERZIJU IMAGE-A

4. I RUNN-OVANJE REBUILD-A DEPLOYMENTA SA KOMANDOM
  `kubectl apply -f <depl config file name>`

**ISPROBACU SDA OVAJ METOD**


