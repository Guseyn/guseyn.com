#!/bin/bash
ssh root@209.97.128.89 bash -c "'
if [ ! -d guseyn.com ]
then
  git clone https://github.com/Guseyn/guseyn.com.git guseyn.com
  git config --global user.email \"guseynism@gmail.com\"
  npm install @page-libs/cli -g
  cd guseyn.com
  npm install --no-optional
  mkdir logs
else
  cd guseyn.com
  git fetch --all
  git reset --hard origin/master
  git pull
  npm install --no-optional
  page b prod
  git add --all
  git commit -m \"local build changes\"
fi
'"

# if needed
#  curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.0/install.sh | bash
#  nvm --version
#  nvm install --lts
#  nvm use --lts
# npm install npm -g
# npm install @page-libs/cli -g
