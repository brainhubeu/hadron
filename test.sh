#!/bin/bash
port="${PORT:-8080}"

trap 'kill $!' EXIT

PORT="$port" npm run start:test &
tries=0
while ! echo exit 1 | nc localhost "$port";
do
  if ((tries >= 10))
  then
    echo 'Cannot connect to test server!'
    exit 1;
  fi
  ((tries++))
  sleep 5;
done
npm run test:cucumber
