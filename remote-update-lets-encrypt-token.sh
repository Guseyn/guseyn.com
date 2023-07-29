#!/bin/bash
ssh -i guseyn_rsa root@46.101.16.208 bash -c "'
cd guseyn.com
rm lets-encrypt-token
echo "$1" > lets-encrypt-token
'"
