#!/bin/bash
ssh -i guseyn_rsa root@46.101.16.208 bash -c "'
cd guseyn.com
git fetch --all
git reset --hard origin/master
git pull
npm install
npm run guseyn:prod:start
'"
