FROM node:12.13-alpine

ENV NODE_ENV=production

RUN mkdir -p /usr/src/app

COPY / /usr/src/app/

RUN cd /usr/src/app/ &&\
  npm install --production

WORKDIR /usr/src/app

CMD node index.js

