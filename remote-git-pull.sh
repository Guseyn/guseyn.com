#!/bin/bash
ssh -i guseyn_rsa root@46.101.16.208 bash -c "'
cd guseyn.com
git fetch --all
git reset --hard origin/master
git pull
node use-cdn.js clean web-app https://guseyn.com https://guseyn.b-cdn.net && node use-cdn.js update web-app https://guseyn.com https://guseyn.b-cdn.net
'"
