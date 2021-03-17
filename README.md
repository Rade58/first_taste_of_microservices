# DOCKERIZING THE Posts SERVICE

- `touch posts/Dockerfile`

NECU MNOGO KOMENTARISATI VEC CU POKUSATI DA PRIMENIM ONO STO SAM NAUCIO PRAVECI IMAGE-OVE I CONTAINERE OD RANIJE

[BASE IMAGE CE BITI NEKA NODE VERZIJA, ALI CE BITI BAREBONES alpine VERZIJA](https://hub.docker.com/_/node)

DEFINISACU WORK DIRECTORY U CONTAINERU

DEFINISACU KOPIRANJE PRVO package.json-A

ZATIM PODESICU INSTLACIONE INSTRUKCIJE (SAMO JEDNU, ZA NODE MODULES)

ZATIM CU DEFINISATI KOPIRNJE SVIH DRUGIH FAJLOVA

I DEFINISEM STARTUP COMMAND

```dockerfile
FROM node:lts-alpine3.12

WORKDIR /app

COPY ./package.json ./

RUN npm install

COPY ./ ./

CMD ["npm", "start"]

```

ZASTO ODVOJENO KOPIRANJE package.json; TO SAM VEC REKAO PRI UPOZNAVAANJU SA DOCKEROM; A VAZNIJE STVAR JE TU DA TO RADIM PRE INSTLACIJE NODE MODULE-A JER JE PACKAGE JSON SAMO POTREBAN ZA INSTLACIIJU

A ONO OSTLO STO SE KOPIRA JE VECINOM CODEBASE, ODNOSNO index.js KOJI JE SKLON PROMENAMA, TOKOM DEVELOPMENTA, I TAKO CE SE OD INSTRUKCIJE NJEGOVOG KOPIRANJA SVE REBUILD-OVATI, A PRE NJEGA CE SE ZA SVE POSEGNUTI U CACHE (JER SE TO PRE NJEGA NECE MANJTI)

# ALI POSTO SI POKRETAO `npm install` U TVOM FILESYSTEMU; TO ZNACI DA IMAS `node_modules` FOLDER, KOJI NIKAKO NE ZELIS DA KOPIRAS KADA PRAVIS IMAGE; ZATO CES MORATI KORISTITI `,dockerignore` FILE

- `touch posts/.dockerignore`

```dockerignore
node_modules
```

# SADA CU POKUSATI DA IZGRADIM IMAGE

- `cd posts`

- `docker build .`

OUTPUT:

```c
Sending build context to Docker daemon  56.83kB
Step 1/6 : FROM node:lts-alpine3.12
lts-alpine3.12: Pulling from library/node
f84cab65f19f: Pull complete 
c1498f218859: Pull complete 
e911cafd0b8d: Pull complete 
3d11014629f2: Pull complete 
Digest: sha256:aed8ac10548375da1c15e817b6d5d03e67d84cac5dfef922a76a7675d5c9642a
Status: Downloaded newer image for node:lts-alpine3.12
 ---> 8f86419010df
Step 2/6 : WORKDIR /app
 ---> Running in d602c7014939
Removing intermediate container d602c7014939
 ---> 3df7ea4a3b01
Step 3/6 : COPY ./package.json ./
 ---> e04bc272c15f
Step 4/6 : RUN npm install
 ---> Running in 547b24b40fa8

> nodemon@2.0.7 postinstall /app/node_modules/nodemon
> node bin/postinstall || exit 0

Love nodemon? You can now support the project via the open collective:
 > https://opencollective.com/nodemon/donate

npm notice created a lockfile as package-lock.json. You should commit this file.
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: fsevents@~2.3.1 (node_modules/chokidar/node_modules/fsevents):
npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for fsevents@2.3.2: wanted {"os":"darwin","arch":"any"} (current: {"os":"linux","arch":"x64"})
npm WARN posts@1.0.0 No description
npm WARN posts@1.0.0 No repository field.

added 171 packages from 90 contributors and audited 172 packages in 14.923s

12 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities

Removing intermediate container 547b24b40fa8                                                                                                                                                                  
 ---> df94d2cf1d8d                                                                                                                                                                                            
Step 5/6 : COPY ./ ./                                                                                                                                                                                         
 ---> 4090e9938ff8                                                                                                                                                                                            
Step 6/6 : CMD ["npm", "start"]                                                                                                                                                                               
 ---> Running in 9c9b0d4269d2                                                                                                                                                                                 
Removing intermediate container 9c9b0d4269d2                                                                                                                                                                  
 ---> 0ebf39d2efa1                                                                                                                                                                                            
Successfully built 0ebf39d2efa1  
```

## MOZES DA UZMED IMAGE ID DA INSTATICIZIRAS CONTAINER

- `dockker run 0ebf39d2efa1`

OUTPUT:

```c
> posts@1.0.0 start /app                                                           
> npx nodemon index.js

[nodemon] 2.0.7   
[nodemon] to restart at any time, enter `rs`

[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node index.js`
listening on: http://localhost:4000

```
