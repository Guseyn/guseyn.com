#!/bin/bash
ssh -i guseyn_rsa root@174.138.15.193 bash -c "'
cd guseyn.com
git fetch --all
git reset --hard origin/master
git pull
pkill node

# Remove all containers
docker rm -f \$(docker ps -aq) || echo "No containers to remove"

# Remove unused volumes
docker volume prune -f || echo "No volumes to prune"

# Remove all images
docker rmi -f \$(docker images -q) || echo "No images to remove"

DOMAIN=guseyn.com,www.guseyn.com DOMAIN_EMAIL=guseyn@guseyn.com docker-compose -f docker-compose.prod.yml up --build --force-recreate --remove-orphans
'"
