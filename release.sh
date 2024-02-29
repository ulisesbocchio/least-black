#!/usr/bin/env bash

set -e

if [[ $1 != *"major"* ]] && [[ $1 != *"minor"* ]] && [[ $1 != *"patch"* ]]; then
    echo "usage: ./release major|minor|patch"
    exit 1
fi

if [ -n "$(git status --porcelain)" ]; then
	echo "Git Repository is not clean. Commit/revert all changes prior to release"
	exit 1
fi

remote=`git remote`
branch=`git rev-parse --abbrev-ref HEAD`
version=`node -e 'console.log(require("./package.json").version)'`

echo "Cleaning Directory..."
rm -f *.tgz

echo "Setting New Release Version..."
yarn "--no-git-tag-version version --${1}"
new_version=`node -e 'console.log(require("./package.json").version)'`
git add ./package.json
git commit -m "New Release Version ${new_version}"
git push ${remote} ${branch}

echo "Cleaning..."
yarn run clean

echo "Building..."
yarn run build

echo "Uploading Artifact..."
yarn publish --new-version ${new_version}

echo "Tagging..."
git tag -a ${new_version} -m "NPM Package Release ${new_version}"
git push ${remote} --tags


echo "Done!"