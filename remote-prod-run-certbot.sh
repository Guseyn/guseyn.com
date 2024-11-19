#!/bin/bash
ssh -i guseyn_rsa root@174.138.15.193 bash -c "'
cd guseyn.com
git fetch --all
git reset --hard origin/master
git pull
pkill node

DOMAIN=guseyn.com DOMAIN_EMAIL=guseyn@guseyn.com CERTBOT_MODE=generate docker-compose run --build cerbot -f docker-compose.prod.yml --rm

CRON_JOB="0 0 * * * docker-compose run --rm certbot CERTBOT_MODE=renew"
(crontab -l 2>/dev/null | grep -F "$CRON_JOB") && echo "Cron job already exists." && exit 0
(crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -
echo "Cron job added: $CRON_JOB"
'"
