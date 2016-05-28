#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
CLONE_DIR="shopify-gh-pages"

echo $DIR

cd /tmp
rm -rf ${CLONE_DIR}
mkdir ${CLONE_DIR}
cd ${CLONE_DIR}

git init
git remote add -t refspec gh-pages git@github.com:chmurson/shopify.git
git fetch
git pull gh-pages
