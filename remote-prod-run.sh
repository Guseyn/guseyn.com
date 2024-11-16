#!/bin/bash
ssh -i guseyn_rsa root@174.138.15.193 bash -c "'
cd guseyn.com
git fetch --all
git reset --hard origin/master
git pull
npm install
pkill node
docker rm -f $(docker ps -aq) && docker rmi -f $(docker images -q)
DOMAIN=guseyn.com,www.guseyn.com DOMAIN_EMAIL=guseyn@guseyn.com docker-compose -f docker-compose.prod.yml up --build --force-recreate --remove-orphans
'"
