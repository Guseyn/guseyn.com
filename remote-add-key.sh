#!/bin/bash
ssh -i deploy_rsa root@209.97.128.89 bash -c "'
cd guseyn.com
git pull
'"
