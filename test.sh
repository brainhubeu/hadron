#!/bin/bash
port="${PORT:-8080}"

trap 'kill $!' EXIT

npm run start &
while ! echo exit | nc localhost "$port"; do sleep 1; done
npm run test:cucumber
