#!/bin/bash
ssh -i guseyn_rsa root@46.101.16.208 bash -c "'
if [ ! -d guseyn.com ]
then
  git clone https://github.com/Guseyn/guseyn.com.git guseyn.com
  git config --global user.email \"guseyn@guseyn.com\"
  cd guseyn.com
  mkdir logs
  npm install
  node use-cdn.js clean https://guseyn.com https://cdn.guseyn.com
  node use-cdn.js update https://guseyn.com https://cdn.guseyn.com
  npm run guseyn:prod
else
  killall -s KILL node
  cd guseyn.com
  git fetch --all
  git reset --hard origin/master
  git pull
  npm install
  node use-cdn.js clean https://guseyn.com https://cdn.guseyn.com
  node use-cdn.js update https://guseyn.com https://cdn.guseyn.com
  npm run guseyn:prod
fi
'"
