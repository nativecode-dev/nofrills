#!/bin/bash

export RELEASE=${RELEASE:="prerelease"}
export TRAVIS_BRANCH=${TRAVIS_BRANCH:="invalid"}

if [[ ${TRAVIS_BRANCH:="invalid"} = "master" && ${TRAVIS_EVENT_TYPE:="push"} = "push" ]]; then
  export RELEASE=major
fi

if [[ ${TRAVIS_BRANCH:="invalid"} = "master-lts" && ${TRAVIS_EVENT_TYPE:="push"} = "push" ]]; then
  export RELEASE=minor
fi
