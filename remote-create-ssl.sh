#!/bin/bash
ssh -i deploy_rsa root@209.97.128.89 bash -c "'
sudo apt update && sudo apt upgrade
sudo git clone https://github.com/letsencrypt/letsencrypt /opt/letsencrypt
killall -s KILL node
cd /opt/letsencrypt
sudo -H ./letsencrypt-auto certonly --standalone --renew-by-default -d guseyn.com -d www.guseyn.com
cd
cp /etc/letsencrypt/live/guseyn.com/cert.pem guseyn.com/cert.pem
cp /etc/letsencrypt/live/guseyn.com/privkey.pem guseyn.com/key.pem
cd guseyn.com
page r prod
'"
