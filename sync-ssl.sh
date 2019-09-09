#!/bin/bash
scp -i deploy_rsa root@209.97.128.89:/etc/letsencrypt/live/guseyn.com/cert.pem cert.pem
scp -i deploy_rsa root@209.97.128.89:/etc/letsencrypt/live/guseyn.com/privkey.pem key.pem
