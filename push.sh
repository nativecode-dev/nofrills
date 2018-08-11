#!/bin/bash

export RELEASE=${RELEASE:="prerelease"}

TRAVIS_BRANCH=${TRAVIS_BRANCH:="invalid"}

if [ $TRAVIS_BRANCH = "master" ] && [ $TRAVIS_EVENT_TYPE = "push" ]; then
  RELEASE=patch
  lerna publish --allow-branch $TRAVIS_BRANCH --cd-version $RELEASE --message "$TRAVIS_BRANCH:$RELEASE:%s" --yes --npm-tag latest
fi

if [ $TRAVIS_BRANCH = "master-lts" ] && [ $TRAVIS_EVENT_TYPE = "push" ]; then
  RELEASE=minor
  lerna publish --allow-branch $TRAVIS_BRANCH --cd-version $RELEASE --message "$TRAVIS_BRANCH:$RELEASE:%s" --yes --npm-tag lts
fi

if [ $TRAVIS_BRANCH = "develop" ] && [ $TRAVIS_EVENT_TYPE = "push" ]; then
  RELEASE=prerelease
  lerna publish --allow-branch $TRAVIS_BRANCH --cd-version $RELEASE --message "$TRAVIS_BRANCH:$RELEASE:%s" --yes --npm-tag next
fi

echo "RELEASE=$RELEASE, BRANCH=$TRAVIS_BRANCH, EVENT=$TRAVIS_EVENT_TYPE"
