#!/bin/bash
ssh -i deploy_rsa bitnami@3.9.27.159 bash -c "'
cd guseyn.com
page r prod
'"

# /etc/letsencrypt/live/guseyn.com/fullchain.pem
# /etc/letsencrypt/live/guseyn.com/privkey.pem
