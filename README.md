# DOCKERIZING ALL OF MY SERVICES

DODACU `Dockerfile` I `.dockerignore` I ZA SVE OSTALE SERVICES (RANIJE SAM TO URADIO SAMO ZA posts)

PA CU ONDA BUILD-OVATI IA

U SUSTINA JA MOGU SAMO KOPIRATI OVA DVA FAJLA, IZ POSTS SERVICE-A I PAST-OVATI GA U FOLDERE DRUGIS SERVICE-OVA

- `cp posts/.dockerignore posts/Dockerfile comments`
- `cp posts/.dockerignore posts/Dockerfile moderation`
- `cp posts/.dockerignore posts/Dockerfile query`
- `cp posts/.dockerignore posts/Dockerfile event_bus`

ALI IMAM PROBLEMA, A TO JE REACT PROJECT

TREBAO SAM IPAK DA GA PODESIM DA ON BUDE U SEPARATE FOLDERU, KAKO BIH I TAMO MOGAO DA PASS-UJEM DOCKER FAJLOVE

TO CU SADA DA URADIM

- `rm -rf node_modules`

- `mkdir client`

PREBACICU SVE STO SE TICE REACT-A U GORNJI FOLDER

U STVARI TO CE BITI SAMO `package.json` I `src` I `public` FOLDER

NODE MODULES IZ ROOT DIRECTORY-JA MOZES POPPTPUNO DA DELET-UJES

- `cp posts/.dockerignore posts/Dockerfile client`
