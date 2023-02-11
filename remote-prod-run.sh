#!/bin/bash
ssh -i deploy_rsa root@209.97.128.89 bash -c "'
if [ ! -d guseyn.com ]
then
  git clone https://github.com/Guseyn/guseyn.com.git guseyn.com
  git config --global user.email \"guseyn@guseyn.com\"
  cd guseyn.com
  npm install
  npm run guseyn:prod
else
  node -v
fi
'"
