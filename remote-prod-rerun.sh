#!/bin/bash
ssh -i guseyn_rsa root@46.101.16.208 bash -c "'
cd guseyn.com
git fetch --all
git reset --hard origin/master
git pull

docker exec -it guseyn.com npm run guseyn:prod:restart
'"
