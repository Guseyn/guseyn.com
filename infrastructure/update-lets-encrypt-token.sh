#!/bin/bash
# token after dot
ssh -i guseyn_rsa root@46.101.16.208 bash -c "'
cd guseyn.com
rm lets-encrypt-token
echo "ItPeh2tGkAZisHn32SmoYq0G_5LgCaZkRU_dkuBJk9U" > lets-encrypt-token
'"
