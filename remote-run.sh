#!/bin/bash
ssh -i deploy_rsa root@209.97.128.89 bash -c "'
cd guseyn.com
page r prod &
NODE_ENV=prod node server/app/proxy.js 
'"

# /etc/letsencrypt/live/guseyn.com/fullchain.pem
# /etc/letsencrypt/live/guseyn.com/privkey.pem
