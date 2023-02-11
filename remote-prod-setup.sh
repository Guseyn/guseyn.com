#!/bin/bash
ssh -i guseyn_rsa root@46.101.16.208 bash -c "'
if [ ! -d guseyn ]
then
  git clone git@github.com:Guseyn/guseyn.com.git
  git config --global user.email \"guseyn@guseyn.com\"
  cd guseyn
  npm install
  mkdir logs
  npm run guseyn-prod-setup
else
  cd guseyn
  git fetch --all
  git reset --hard origin/master
  git pull
  npm install
  npm run guseyn-prod-setup
fi
'"