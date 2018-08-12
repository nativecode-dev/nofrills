#!/bin/bash

export RELEASE=${RELEASE:="prerelease"}

RELEASE=invalid
TRAVIS_BRANCH=${TRAVIS_BRANCH:="invalid"}
TAG=latest

if [ $TRAVIS_BRANCH = "master" ] && [ $TRAVIS_EVENT_TYPE = "push" ]; then
  RELEASE=patch
fi

if [ $TRAVIS_BRANCH = "master-lts" ] && [ $TRAVIS_EVENT_TYPE = "push" ]; then
  RELEASE=minor
  TAG=lts
fi

if [ $TRAVIS_BRANCH = "develop" ] && [ $TRAVIS_EVENT_TYPE = "push" ]; then
  RELEASE=prerelease
  TAG=next
fi

if [ ! $RELEASE = "invalid" ]; then
  MESSAGE="$TRAVIS_BRANCH:$RELEASE:%s"
  echo "RELEASE=$RELEASE, BRANCH=$TRAVIS_BRANCH, EVENT=$TRAVIS_EVENT_TYPE", TAG=$TAG
  echo "$MESSAGE"

  lerna publish bump $RELEASE \
    --allow-branch $TRAVIS_BRANCH \
    --message $MESSAGE \
    --npm-client npm \
    --npm-tag $TAG \
    --yes \
    --verify-access \
    --verify-registry \
  ;
fi
