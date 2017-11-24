#!/bin/bash

RELEASE=${RELEASE:="prerelease"}
TRAVIS_BRANCH=${TRAVIS_BRANCH:="invalid"}

if [ $TRAVIS_BRANCH = "master" ] && [ $TRAVIS_EVENT_TYPE = "push" ]; then
  RELEASE=major
fi

if [ $TRAVIS_BRANCH  = "master-lts" ] && [ $TRAVIS_EVENT_TYPE = "push" ]; then
  RELEASE=minor
fi

lerna publish --cd-version $RELEASE --message "$TRAVIS_BRANCH:$RELEASE:%s"
