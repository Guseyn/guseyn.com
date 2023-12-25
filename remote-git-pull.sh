#!/bin/bash
ssh -i guseyn_rsa root@46.101.16.208 bash -c "'
cd guseyn.com
git fetch --all
git reset --hard origin/master
git pull
node use-cdn.js clean https://guseyn.com https://guseyn.b-cdn.net
node use-cdn.js update https://guseyn.com https://guseyn.b-cdn.net
'"
