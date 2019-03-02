#!/bin/bash
ssh -i deploy_rsa ubuntu@3.8.218.230 bash -c "'
cd guseyn.com
page r prod
'"

# /etc/letsencrypt/live/guseyn.com/fullchain.pem
# /etc/letsencrypt/live/guseyn.com/privkey.pem
