#!/bin/bash

export BRANCH=${TRAVIS_BRANCH:="develop"}
export EVENT=${TRAVIS_EVENT_TYPE:="push"}
export TAG=next
export TYPE=${TYPE:="prepatch"}

if [ $BRANCH = "master" ] && [ $EVENT = "push" ]; then
  TAG=latest
  TYPE=patch
fi

if [ $BRANCH = "master-lts" ] && [ $EVENT = "push" ]; then
  TAG=lts
  TYPE=minor
fi

if [ $BRANCH = "develop" ] && [ $EVENT = "push" ]; then
  TAG=next
fi

MESSAGE="$BRANCH:$TYPE:%s"
echo "TYPE=$TYPE, BRANCH=$BRANCH, EVENT=$EVENT", TAG=$TAG
echo "$MESSAGE"

cat <<EOF
lerna publish $TYPE --allow-branch $BRANCH --message $MESSAGE --npm-tag $TAG
EOF
lerna publish $TYPE --allow-branch $BRANCH --message $MESSAGE --npm-tag $TAG
