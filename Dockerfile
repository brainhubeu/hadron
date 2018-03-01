FROM keymetrics/pm2:8-alpine

COPY .env /.env
COPY entrypoint.sh /
COPY package.json /usr/src/app/package.json

WORKDIR /tmp/app

RUN apk --no-cache add git openssh-client curl

COPY . /tmp/app

RUN export $(cat /.env | xargs) && NODE_ENV=development npm install --progress=false
RUN export $(cat /.env | xargs)  && /tmp/app/node_modules/.bin/tsc --project /tmp/app --outDir /usr/src/app/
RUN export $(cat /.env | xargs) && npm install --progress=false --prefix /usr/src/app/

WORKDIR /usr/src/app

CMD ["npm", "run", "start:production"]
