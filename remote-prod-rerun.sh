#!/bin/bash
ssh -i ~/.ssh/deploy_rsa root@174.138.15.193 bash -c "'
cd guseyn.com
git fetch --all
git reset --hard origin/master
git pull

docker exec guseyn.com npm run guseyn:prod:restart
'"
