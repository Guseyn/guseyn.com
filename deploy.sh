#!/bin/bash
ssh ubuntu@3.8.218.230 bash -c "'
if [ ! -d guseyn.com ]
then
  git clone https://github.com/Guseyn/guseyn.com.git guseyn.com
  npm install @page-libs/cli -g
  cd guseyn.com
else
  cd guseyn.com
  git stash
  git pull
fi
npm install --no-optional
page b prod
'"

# if needed
#  curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.0/install.sh | bash
#  nvm --version
#  nvm install --lts
#  nvm use --lts
# npm install npm -g
# npm install @page-libs/cli -g
