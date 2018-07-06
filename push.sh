#!/bin/bash

export RELEASE=${RELEASE:="prerelease"}

TRAVIS_BRANCH=${TRAVIS_BRANCH:="invalid"}

if [ $TRAVIS_BRANCH = "master" ] && [ $TRAVIS_EVENT_TYPE = "push" ]; then
  RELEASE=patch
fi

if [ $TRAVIS_BRANCH = "master-lts" ] && [ $TRAVIS_EVENT_TYPE = "push" ]; then
  RELEASE=minor
fi

if [ $TRAVIS_BRANCH = "develop" ] && [ $TRAVIS_EVENT_TYPE = "push" ]; then
  RELEASE=prelease
fi

lerna publish --allow-branch $TRAVIS_BRANCH --cd-version $RELEASE --message "$TRAVIS_BRANCH:$RELEASE:%s" --yes
