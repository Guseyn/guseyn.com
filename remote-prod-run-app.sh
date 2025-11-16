#!/bin/bash
set -euo pipefail

echo "🚀 Starting production rebuild on guseyn.com..."

ssh -A -t -i ~/.ssh/deploy_rsa root@174.138.15.193 "bash -l -c '
  set -euo pipefail
  export PATH=/usr/bin:/usr/sbin:/bin:/sbin:/usr/local/bin:\$PATH

  cd guseyn.com

  echo \"🌐 Fetching latest repo changes...\"
  git fetch --all
  git reset --hard origin/master
  git pull origin master --no-rebase

  echo \"💀 Stopping container guseyn.com...\"
  docker stop guseyn.com 2>/dev/null || echo \"Container not running.\"

  echo \"🗑 Removing container guseyn.com...\"
  docker rm guseyn.com 2>/dev/null || echo \"Already removed.\"

  echo \"🧼 Removing dangling images...\"
  docker image prune -f

  echo \"🚢 Building and starting new production container...\"
  docker compose -f docker-compose.prod.app.yml up --build -d

  echo \"🎉 Deployment completed successfully!\"
'"

