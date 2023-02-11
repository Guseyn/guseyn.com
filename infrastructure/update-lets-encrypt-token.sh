#!/bin/bash
ssh -i guseyn_rsa root@46.101.16.208 bash -c "'
cd unison
rm lets-encrypt-token
echo "<insert here what certbot suggests>" > lets-encrypt-token
'"
