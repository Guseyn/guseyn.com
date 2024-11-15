#!/bin/bash
ssh -i unisonofficial_rsa root@46.101.16.208 bash -c "'
sudo ufw allow 80
sudo ufw allow 443
sudo add-apt-repository ppa:certbot/certbot
sudo apt-get update
sudo apt-get install certbot
sudo certbot certonly --manual
'"
