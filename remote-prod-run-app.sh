#!/bin/bash
ssh -i ~/.ssh/deploy_rsa root@174.138.15.193 bash -c "'
cd guseyn.com
git fetch --all
git reset --hard origin/master
git pull
pkill node

docker-compose build app -f docker-compose.prod.yml
docker-compose run app --build -f docker-compose.prod.yml
docker image prune -f
'"
