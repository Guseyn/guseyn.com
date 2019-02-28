#!/bin/bash
ssh -i deploy_rsa root@5.187.7.231 bash -c "'
cd guseyn.com
page r prod
'"

# /etc/letsencrypt/live/guseyn.com/fullchain.pem
# /etc/letsencrypt/live/guseyn.com/privkey.pem
