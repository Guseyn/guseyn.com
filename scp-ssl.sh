scp -i deploy_rsa key.pem root@209.97.128.89:guseyn.com/key.pem
scp -i deploy_rsa cert.pem root@209.97.128.89:guseyn.com/cert.pem

# ssh -i deploy_rsa root@209.97.128.89
# sudo apt update && sudo apt upgrade
# sudo git clone https://github.com/letsencrypt/letsencrypt /opt/letsencrypt

# killall -s KILL node
# cd /opt/letsencrypt
# sudo -H ./letsencrypt-auto certonly --standalone --renew-by-default -d guseyn.com -d www.guseyn.com

# exit to local guseyn.com
# scp -i deploy_rsa root@209.97.128.89:/etc/letsencrypt/live/guseyn.com/cert.pem cert.pem
# scp -i deploy_rsa root@209.97.128.89:/etc/letsencrypt/live/guseyn.com/privkey.pem key.pem
# scp -i deploy_rsa key.pem root@209.97.128.89:guseyn.com/key.pem
# scp -i deploy_rsa cert.pem root@209.97.128.89:guseyn.com/cert.pem
