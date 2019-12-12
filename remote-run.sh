#!/bin/bash
ssh -i deploy_rsa root@209.97.128.89 bash -c "'
cd guseyn.com
killall -s KILL node
page br prod &
NODE_ENV=prod node server/proxy.js 
'"

# /etc/letsencrypt/live/guseyn.com/fullchain.pem
# /etc/letsencrypt/live/guseyn.com/privkey.pem

# page r test & NODE_ENV=test node server/proxy.js
# page r prod & NODE_ENV=test node server/proxy.js
