# MAKING ALIAS FOR `kubectl` COMMAND

ZELIM DA NAPRAVIM DA MI `k` BUDE ALIAS ZA `kubectl` COMMND

OVO CU URADITI SAMO ZA z shell ONDONSO `zsh`

- `zsh`

- `code ~/.zshrc`

DODACU SAMO OVAJ LINE

```zsh
alias k="kubectl"
```

SAMO TRBA DA SAVE-UJES I MOZES DA ISPROBAS

- `k get pods`

I ZAISTA FUNKCIONISE

```zsh
NAME    READY   STATUS    RESTARTS   AGE
posts   1/1     Running   0          20m
```
