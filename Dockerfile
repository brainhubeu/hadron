FROM keymetrics/pm2:8-alpine

COPY .env /.env
COPY entrypoint.sh /
COPY package.json /usr/src/app/package.json

WORKDIR /usr/src/app

RUN apk --no-cache add git openssh-client curl
RUN export $(cat /.env | xargs) && npm install -g --progress=false \
    Unitech/pm2\#development \
    babel-cli babel-preset-env

COPY . /tmp/app

RUN export $(cat /.env | xargs) && \
    babel /tmp/app --out-dir /usr/src/app --copy-files --ignore node_modules \
    --presets /usr/local/lib/node_modules/babel-preset-env \
    --ignore __tests__

RUN export $(cat /.env | xargs) && \
    npm install --progress=false --prefix /usr/src/app/ \
    && touch /usr/src/app/node_modules/.lock

CMD ["npm", "run", "start:production"]
