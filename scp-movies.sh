ssh -i ~/.ssh/deploy_rsa root@174.138.15.193 "mkdir -p guseyn/web-app/static/mov"
scp -i ~/.ssh/deploy_rsa -r web-app/static/mov/ root@174.138.15.193:guseyn/web-app/static/mov/