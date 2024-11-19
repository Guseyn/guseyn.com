#!/bin/bash
ssh -i ~/.ssh/deploy_rsa root@174.138.15.193 bash -c "'
cd guseyn.com
git fetch --all
git reset --hard origin/master
git pull
pkill node

DOMAIN=guseyn.com DOMAIN_EMAIL=guseyn@guseyn.com CERTBOT_MODE=generate docker-compose -f docker-compose.prod.certbot.yml run --rm certbot

CRON_JOB=\"0 0 * * * DOMAIN=guseyn.com DOMAIN_EMAIL=guseyn@guseyn.com CERTBOT_MODE=renew docker-compose -f docker-compose.prod.cerbot.yml run --rm certbot\"
CURRENT_CRON=\$(crontab -l 2>/dev/null || echo \"\")
if echo \"\$CURRENT_CRON\" | grep -Fq \"\$CRON_JOB\"; then
    echo \"Cron job already exists. Exiting.\"
else
    # Add the new cron job
    (echo \"\$CURRENT_CRON\"; echo \"\$CRON_JOB\") | crontab -
    echo \"Cron job added.\"
fi
'"
