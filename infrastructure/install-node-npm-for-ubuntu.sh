#!/bin/bash
ssh -i guseyn_rsa root@46.101.16.208 bash -c "'
curl -sL https://deb.nodesource.com/setup_16.x -o /tmp/nodesource_setup.sh
sudo bash /tmp/nodesource_setup.sh
sudo apt install nodejs
node -v
npm -v
'"
