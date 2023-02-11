#!/bin/bash
ssh -i deploy_rsa root@209.97.128.89 bash -c "'
sudo apt update && sudo apt upgrade
cd /opt/letsencrypt
sudo -H ./letsencrypt-auto certonly --standalone --renew-by-default -d guseyn.com -d www.guseyn.com
cd
cp /etc/letsencrypt/live/guseyn.com/fullchain.pem guseyn.com/cert.pem
cp /etc/letsencrypt/live/guseyn.com/privkey.pem guseyn.com/key.pem
cd guseyn.com
npm run guseyn:prod:restart
'"
