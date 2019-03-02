#!/bin/bash
ssh -i deploy_rsa ubuntu@3.8.214.2 bash -c "'
cd guseyn.com
page r prod
'"

# /etc/letsencrypt/live/guseyn.com/fullchain.pem
# /etc/letsencrypt/live/guseyn.com/privkey.pem
