#!/bin/sh -

BRANCH="$TRAVIS_BRANCH"

while test $# -gt 0
do
  case "$1" in
    doc) echo "Generating documentation"
      typedoc --mode modules --out ./docs ./packages/*/src/
      ;;
    git) echo "Configuring Git options"
      git config --global user.email "opensource+nofrills@nativecode.com"
      git config --global user.name "Native Open Source"
      git config --global push.default simple
      ;;
    ssh) echo "Configuring SSH credentials"
      set-up-ssh --key "$encrypted_fa989ae4fdf1_key" --iv "$encrypted_fa989ae4fdf1_iv" --path-encrypted-key "deploy.enc"
      ;;
  esac
  shift
done

exit 0
