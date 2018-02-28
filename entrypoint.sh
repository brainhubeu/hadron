#!/usr/bin/env bash
set -e

if [ ! -f /usr/src/app/node_modules/.lock ] && [ -f /usr/src/app/package.json ]; then
    npm install --progress=false
    touch /usr/src/app/node_modules/.lock
fi

exec "$@"
