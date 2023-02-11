#!/bin/bash
ssh -i guseyn_rsa root@46.101.16.208 bash -c "'
if [ ! -d guseyn.com ]
then
  git clone git@github.com:Guseyn/guseyn.com.git
  git config --global user.email \"guseyn@guseyn.com\"
  cd guseyn.com
  npm install
  npm run guseyn:prod:setup
else
  cd guseyn.com
  git fetch --all
  git reset --hard origin/master
  git pull
  npm install
  npm run guseyn:prod:setup
fi
'"