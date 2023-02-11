#!/bin/bash
# ssh -i guseyn_rsa root@46.101.16.208

ssh-keygen -t ed25519 -C "guseyn@guseyn.com"
eval `ssh-agent -s`
ssh-add /root/.ssh/id_ed25519
cat /root/.ssh/id_ed25519.pub