#!/bin/bash
set -euo pipefail

echo "🔐 Running remote certbot setup on guseyn.com..."

ssh -A -t -i ~/.ssh/deploy_rsa root@174.138.15.19 "bash -l -c '
  set -euo pipefail
  cd guseyn.com

  echo \"🌐 Fetching all branches...\"
  git fetch --all

  echo \"🧹 Resetting to origin/master...\"
  git reset --hard origin/master

  echo \"⬇️ Pulling latest changes from master...\"
  git pull origin master --no-rebase || true


  echo \"📁 Ensuring ACME directories exist...\"
  mkdir -p ./web-app/.well-known/acme-challenge ./web-app/ssl


  echo \"💀 Stopping certbot container...\"
  docker stop certbot 2>/dev/null || echo \"certbot not running.\"

  echo \"🗑 Removing certbot container...\"
  docker rm certbot 2>/dev/null || echo \"certbot container already removed.\"

  echo \"🧼 Removing certbot image...\"
  CERTBOT_IMAGE_ID=\$( docker images --format \"{{.ID}} {{.Repository}}\" \
    | awk \"\\\$2 ~ /^certbot\\\\/certbot(:|$)/ {print \\\$1}\" || true )

  if [ -n \"\$CERTBOT_IMAGE_ID\" ]; then
    echo \"Removing image \$CERTBOT_IMAGE_ID...\"
    docker rmi -f \"\$CERTBOT_IMAGE_ID\" || true
  else
    echo \"No certbot image found.\"
  fi


  echo \"📄 Installing certbot-entry.sh...\"
  chmod +x certbot-entry.sh


  echo \"🚀 Running one-time certificate issuance...\"
  export DOMAIN=guseyn.com
  export DOMAIN_EMAIL=guseyn@guseyn.com
  export CERTBOT_MODE=generate

  docker compose -f docker-compose.prod.certbot.yml run --rm certbot


  echo \"📜 Listing installed certificates...\"
  docker compose -f docker-compose.prod.certbot.yml run --rm certbot sh -lc \"certbot certificates || true\"


  echo \"⏰ Installing daily renewal cron...\"
  PROJECT_DIR=\$(pwd)

  CRON_LINE=\"0 0 * * * PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin cd \$PROJECT_DIR && DOMAIN=guseyn.com DOMAIN_EMAIL=guseyn@guseyn.com CERTBOT_MODE=renew docker compose -f docker-compose.prod.certbot.yml run --rm certbot >> /var/log/certbot-renew.log 2>&1\"

  CURRENT_CRON=\$(crontab -l 2>/dev/null || true)
  FILTERED_CRON=\$(printf \"%s\n\" \"\$CURRENT_CRON\" | grep -v \"docker compose -f docker-compose.prod.certbot.yml\" || true)
  printf \"%s\n%s\n\" \"\$FILTERED_CRON\" \"\$CRON_LINE\" | crontab -


  echo \"📅 Cron job installed:\"
  crontab -l | sed -n \"s/^/  /p\"

  echo \"✅ Certbot setup complete!\"
'"

