#!/bin/bash
port="${PORT:-8080}"

trap 'kill $!' EXIT

PORT="$port" npm run start:test &
while ! echo exit | nc localhost "$port"; do sleep 1; done
npm run test:cucumber
