#!/bin/bash

source .env.sh

lerna publish --cd-version $RELEASE --message "$TRAVIS_BRANCH:$RELEASE:%s"
