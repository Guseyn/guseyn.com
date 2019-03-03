#!/bin/bash
ssh root@209.97.128.89 bash -c "'
if [ ! -d guseyn.com ]
then
  git clone https://github.com/Guseyn/guseyn.com.git guseyn.com
  npm install @page-libs/cli -g
  cd guseyn.com
else
  cd guseyn.com
  git pull
fi
npm install --no-optional
'"

# if needed
#  curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.0/install.sh | bash
#  nvm --version
#  nvm install --lts
#  nvm use --lts
# npm install npm -g
# npm install @page-libs/cli -g
