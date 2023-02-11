#!/bin/bash
ssh -i unisonofficial_rsa root@209.97.128.89 bash -c "'
cd guseyn.com
git fetch --all
git reset --hard origin/master
git pull
npm install
npm run guseyn:prod:restart
'"
