#!/bin/bash
set -euo pipefail

echo "🚀 Starting production restart for guseyn.com..."

ssh -A -t -i ~/.ssh/deploy_rsa root@174.138.15.193 "bash -l -c '
  set -euo pipefail
  cd guseyn.com

  echo \"🌐 Fetching all branches...\"
  git fetch --all

  echo \"🧹 Resetting to origin/master...\"
  git reset --hard origin/master

  echo \"⬇ Pulling latest changes from master...\"
  git pull origin master --no-rebase

  echo \"🔁 Restarting production container...\"
  docker exec guseyn.com npm run guseyn:prod:restart

  echo \"✅ Production restart complete!\"
'"
