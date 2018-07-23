#!/usr/bin/env sh

# this runs unit tests on an individual package
# Usage example: ./package-test.sh oauth
./node_modules/mocha/bin/mocha -r ts-node/register packages/hadron-$1/src/__tests__/*
