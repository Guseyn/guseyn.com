#!/bin/bash
ssh root@5.187.7.231 bash -c "'
if [ ! -d guseyn.com ]
then
  git clone https://github.com/Guseyn/guseyn.com.git guseyn.com
  cd guseyn.com
else
  cd guseyn.com
  git pull
fi
npm install @page-libs/cli -g
npm install
pkill -f node
page br
'"
