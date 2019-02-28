#!/bin/bash
set -e
git config --global push.default simple # we only want to push one branch — master
# specify the repo on the live server as a remote repo, and name it 'production'
# <user> here is the separate user you created for deploying
echo "config ok"
git remote add production ssh://root@5.187.7.231/guseyn.com
echo "remote add ok"
git push production master # push our updates
echo "push ok"
