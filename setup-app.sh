#!/usr/bin/env bash
set -euo pipefail

# -------------------------------
# Simple guided inputs (or pass as env vars)
# -------------------------------
REMOTE_HOST="${REMOTE_HOST:-}"      # e.g. root@68.183.115.6
SSH_KEY_PATH="${SSH_KEY_PATH:-$HOME/.ssh/deploy_rsa}"
REPO_SSH_URL="${REPO_SSH_URL:-}"    # e.g. git@github.com:yourname/yourrepo.git
REMOTE_APP_DIR="${REMOTE_APP_DIR:-/opt/lmt-app}"

DOMAIN="${DOMAIN:-}"                # e.g. livemusictutor.com
DOMAIN_EMAIL="${DOMAIN_EMAIL:-}"    # email for Let's Encrypt
USE_SELFSIGNED="${USE_SELFSIGNED:-y}" # y/N
USE_CERTBOT="${USE_CERTBOT:-n}"       # y/N (Let’s Encrypt via dockerized certbot)
USE_EXISTING_CERT="${USE_EXISTING_CERT:-n}"  # y/N (if you already have fullchain+privkey PEM files)

EXISTING_FULLCHAIN_LOCAL="${EXISTING_FULLCHAIN_LOCAL:-}"  # path on your laptop
EXISTING_PRIVKEY_LOCAL="${EXISTING_PRIVKEY_LOCAL:-}"      # path on your laptop

# -------------------------------
# Prompt if missing
# -------------------------------
prompt_if_empty () {
  local varname="$1" ; local prompt="$2"
  if [[ -z "${!varname:-}" ]]; then
    read -r -p "$prompt: " val
    export "$varname"="$val"
  fi
}

prompt_if_empty REMOTE_HOST      "Remote (e.g. root@68.183.115.6)"
prompt_if_empty REPO_SSH_URL     "Repo SSH URL (e.g. git@github.com:you/yourrepo.git)"
prompt_if_empty REMOTE_APP_DIR   "Remote app dir [/opt/lmt-app]"
REMOTE_APP_DIR="${REMOTE_APP_DIR:-/opt/lmt-app}"

read -r -p "Domain (for HTTPS, e.g. example.com) [leave blank to skip]: " DOMAIN_INPUT
DOMAIN="${DOMAIN:-$DOMAIN_INPUT}"

if [[ -n "$DOMAIN" ]]; then
  prompt_if_empty DOMAIN_EMAIL "Email for Let's Encrypt (used by certbot)"
fi

read -r -p "Start app with SELF-SIGNED cert first? (y/N) [$USE_SELFSIGNED]: " ans || true
USE_SELFSIGNED="${ans:-$USE_SELFSIGNED}"

if [[ -n "$DOMAIN" ]]; then
  read -r -p "Obtain Let's Encrypt with CERTBOT now? (y/N) [$USE_CERTBOT]: " ans || true
  USE_CERTBOT="${ans:-$USE_CERTBOT}"
fi

read -r -p "Use EXISTING PEM certificate instead of certbot? (y/N) [$USE_EXISTING_CERT]: " ans || true
USE_EXISTING_CERT="${ans:-$USE_EXISTING_CERT}"
if [[ "$USE_EXISTING_CERT" == "y" || "$USE_EXISTING_CERT" == "Y" ]]; then
  prompt_if_empty EXISTING_FULLCHAIN_LOCAL "Path to fullchain.pem on your machine"
  prompt_if_empty EXISTING_PRIVKEY_LOCAL   "Path to privkey.pem on your machine"
  if [[ ! -f "$EXISTING_FULLCHAIN_LOCAL" || ! -f "$EXISTING_PRIVKEY_LOCAL" ]]; then
    echo "Provided PEM paths not found. Aborting."
    exit 1
  fi
fi

echo
echo "==> Using:"
echo "REMOTE_HOST        = $REMOTE_HOST"
echo "SSH_KEY_PATH       = $SSH_KEY_PATH"
echo "REPO_SSH_URL       = $REPO_SSH_URL"
echo "REMOTE_APP_DIR     = $REMOTE_APP_DIR"
echo "DOMAIN             = ${DOMAIN:-<none>}"
echo "DOMAIN_EMAIL       = ${DOMAIN_EMAIL:-<none>}"
echo "USE_SELFSIGNED     = $USE_SELFSIGNED"
echo "USE_CERTBOT        = $USE_CERTBOT"
echo "USE_EXISTING_CERT  = $USE_EXISTING_CERT"
echo

# Ensure our SSH key is loaded for the SSH connection if you need agent forwarding later.
if [[ -f "$SSH_KEY_PATH" ]]; then
  eval "$(ssh-agent -s)" >/dev/null
  ssh-add "$SSH_KEY_PATH" >/dev/null
fi

# -------------------------------
# 1) Prepare remote: packages, git, docker compose plugin
# -------------------------------
ssh -o StrictHostKeyChecking=accept-new -i "$SSH_KEY_PATH" "$REMOTE_HOST" bash <<'REMOTESSH'
set -euo pipefail

if command -v apt-get >/dev/null 2>&1; then
  export DEBIAN_FRONTEND=noninteractive
  apt-get update -y
  apt-get install -y git curl ca-certificates
else
  echo "Non-Debian base detected. Ensure git/curl are available."
fi

# Ensure docker exists (DO docker droplet has it). Ensure compose v2 plugin exists.
if ! docker --version >/dev/null 2>&1; then
  echo "Docker not found. Please use a Docker base droplet or install Docker first."
  exit 1
fi

if ! docker compose version >/dev/null 2>&1; then
  echo "Docker Compose v2 plugin not found; installing..."
  if command -v apt-get >/dev/null 2>&1; then
    apt-get install -y docker-compose-plugin
  fi
fi
REMOTESSH

# -------------------------------
# 2) Generate SSH key on droplet for GitHub + show public key
# -------------------------------
ssh -i "$SSH_KEY_PATH" "$REMOTE_HOST" bash <<'REMOTESSH'
set -euo pipefail

SSH_DIR="$HOME/.ssh"
KEY_PATH="$SSH_DIR/id_ed25519_github"
mkdir -p "$SSH_DIR"
chmod 700 "$SSH_DIR"

if [[ ! -f "$KEY_PATH" ]]; then
  ssh-keygen -t ed25519 -C "droplet-github" -N "" -f "$KEY_PATH" >/dev/null
fi

echo
echo "============================================="
echo "Add this PUBLIC KEY to your GitHub account:"
echo "(GitHub > Settings > SSH and GPG keys > New SSH Key)"
echo
cat "$KEY_PATH.pub"
echo "============================================="
echo
REMOTESSH

read -r -p "Press Enter AFTER you've added the key to GitHub to continue..." _

# -------------------------------
# 3) Prepare app dir & clone/pull repo
# -------------------------------
ssh -i "$SSH_KEY_PATH" "$REMOTE_HOST" bash <<REMOTESSH
set -euo pipefail

REMOTE_APP_DIR="$REMOTE_APP_DIR"
REPO_SSH_URL="$REPO_SSH_URL"

mkdir -p "\$REMOTE_APP_DIR"
cd "\$REMOTE_APP_DIR"

# Use the droplet's GitHub key
eval "\$(ssh-agent -s)" >/dev/null
ssh-add "\$HOME/.ssh/id_ed25519_github" >/dev/null || true

if [ ! -d ".git" ]; then
  git clone "\$REPO_SSH_URL" .
else
  git fetch --all
  git pull --rebase || true
fi

# Ensure ACME + SSL folders exist
mkdir -p web-app/.well-known/acme-challenge
mkdir -p web-app/ssl
mkdir -p web-app/studios

# Make a basic .env to share DOMAIN/EMAIL with docker compose if needed
if ! grep -q "DOMAIN=" .env 2>/dev/null; then
  {
    echo "DOMAIN=${DOMAIN}"
    echo "DOMAIN_EMAIL=${DOMAIN_EMAIL}"
    echo "CERTBOT_MODE=generate"
  } > .env
fi
REMOTESSH

# -------------------------------
# 4) Optional: copy existing PEM certs to droplet (overrides others)
# -------------------------------
if [[ "$USE_EXISTING_CERT" == "y" || "$USE_EXISTING_CERT" == "Y" ]]; then
  scp -i "$SSH_KEY_PATH" "$EXISTING_FULLCHAIN_LOCAL"  "$REMOTE_HOST:$REMOTE_APP_DIR/web-app/ssl/fullchain.pem"
  scp -i "$SSH_KEY_PATH" "$EXISTING_PRIVKEY_LOCAL"    "$REMOTE_HOST:$REMOTE_APP_DIR/web-app/ssl/privkey.pem"
fi

# -------------------------------
# 5) Optional: create self-signed cert first (quick HTTPS to boot app)
# -------------------------------
if [[ "$USE_SELFSIGNED" == "y" || "$USE_SELFSIGNED" == "Y" ]]; then
ssh -i "$SSH_KEY_PATH" "$REMOTE_HOST" bash <<'REMOTESSH'
set -euo pipefail
cd "$REMOTE_APP_DIR"

if [[ ! -f web-app/ssl/fullchain.pem || ! -f web-app/ssl/privkey.pem ]]; then
  openssl req -x509 -newkey rsa:2048 -nodes \
    -keyout web-app/ssl/privkey.pem \
    -out web-app/ssl/fullchain.pem \
    -days 7 \
    -subj "/CN=selfsigned.local"
  echo "Self-signed cert generated (valid 7 days)."
fi
REMOTESSH
fi

# -------------------------------
# 6) Bring up the APP (uses your repo's docker-compose for the app)
# -------------------------------
ssh -i "$SSH_KEY_PATH" "$REMOTE_HOST" bash <<'REMOTESSH'
set -euo pipefail
cd "$REMOTE_APP_DIR"

# Ensure volume mount target exists (your compose maps /mnt/volume-nyc1-01)
mkdir -p /mnt/volume-nyc1-01 || true

echo "Building and starting app..."
docker compose -f docker-compose.yml build
docker compose -f docker-compose.yml up -d

echo "App containers:"
docker compose -f docker-compose.yml ps
REMOTESSH

# -------------------------------
# 7) Optional: run CERTBOT container to obtain Let's Encrypt cert
# (uses your repo's docker-compose for certbot)
# -------------------------------
if [[ -n "$DOMAIN" && ( "$USE_CERTBOT" == "y" || "$USE_CERTBOT" == "Y" ) ]]; then
ssh -i "$SSH_KEY_PATH" "$REMOTE_HOST" bash <<'REMOTESSH'
set -euo pipefail
cd "$REMOTE_APP_DIR"

# Ensure app is serving ACME path (your app proxies /.well-known/acme-challenge)
echo "Running certbot to generate/renew certificates for \$DOMAIN ..."
# Use env from .env (DOMAIN, DOMAIN_EMAIL, CERTBOT_MODE)
export $(grep -E '^(DOMAIN|DOMAIN_EMAIL|CERTBOT_MODE)=' .env | xargs)

# One-off run via docker compose for certbot
docker compose -f docker-compose.certbot.yml up --abort-on-container-exit
docker compose -f docker-compose.certbot.yml down

# If certs obtained at web-app/ssl, restart the app to pick them up
echo "Restarting app to pick up new certs..."
docker compose -f docker-compose.yml restart

echo "Current SSL files:"
ls -l web-app/ssl || true
REMOTESSH
fi

echo
echo "✅ Done. Your droplet at $REMOTE_HOST is provisioned."
echo "   Repo in: $REMOTE_APP_DIR"
echo "   SSL dir: $REMOTE_APP_DIR/web-app/ssl"
echo "   ACME dir: $REMOTE_APP_DIR/web-app/.well-known/acme-challenge"
echo
