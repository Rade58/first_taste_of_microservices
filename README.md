# REVIEW OF SOME BASIC DOCKER COMMANDS

NEKE OD KOMANDI KOJE SAM NAUCIO

# BUILDING IMAGE-A ALI SA SPECIFICIRANIM TAGOM

- `docker build radebajic/<ime image-a>:<verzija (nije required)> .` (TACKU NE ZABORAVI)

# INSTATICIZIRANJE CONTAINER-A

- `ocker run <ime image-a ili id image-a>`

# INSTATICIZIRANJE CONTAINERA, UZ MOGUCNOST INPUTA, SA LEPSIM INTERFACEOM, UZ OVERRIDINF STARTUP KOMANDE

- `docker run -it <ime inmage-a ili njegov id> <startup command override>`

OVDE SE NAJCESCE KORISTI `sh` KAO OVERRIDE STARTUP KOMANDE, KAKO BI MOGAO UCI U CONTAINER SHELL

# LISTING CURRENTLY RUNNING CONTAINER-A, I LISTING ONIH KOJI SU DO SDA BILI POKRETANI

- `docker ps`

- `docker ps --all`

# POKRETANJE KOMANDI U RUNNING CONTAINERU

- `docker exec -it <container id> <komanda>`

# PRINTING LOG-OVA IZ GIVIEN CONTAINERA

- `docker logs <container id>`
