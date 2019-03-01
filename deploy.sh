#!/bin/bash
ssh root@5.187.7.231 bash -c "'
if [ ! -d guseyn.com ]
then
  git clone https://github.com/Guseyn/guseyn.com.git guseyn.com
  cd guseyn.com
else
  cd guseyn.com
  git stash
  git pull
fi
npm install --no-optional
page b prod
'"

# if needed
# npm install npm -g
# npm install @page-libs/cli -g
