#!/bin/bash

export BRANCH=${TRAVIS_BRANCH:="develop"}
export EVENT=${TRAVIS_EVENT_TYPE:="push"}
export TAG=branch
export TYPE=${TYPE:="prerelease"}

if [ $BRANCH = "master" ] && [ $EVENT = "push" ]; then
  TAG=latest
  TYPE=minor
fi

if [ $BRANCH = "master-lts" ] && [ $EVENT = "push" ]; then
  TAG=lts
  TYPE=major
fi

if [ $BRANCH = "develop" ] && [ $EVENT = "push" ]; then
  TAG=next
  TYPE=patch
fi

MESSAGE="$BRANCH:$TYPE:%s"
echo "TYPE=$TYPE, BRANCH=$BRANCH, EVENT=$EVENT", TAG=$TAG
echo "$MESSAGE"

cat <<EOF
lerna publish $TYPE --allow-branch $BRANCH --message $MESSAGE --npm-tag $TAG
EOF
lerna publish $TYPE --allow-branch $BRANCH --message $MESSAGE --npm-tag $TAG
