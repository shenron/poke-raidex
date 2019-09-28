FROM node:10.16-alpine

RUN mkdir -p /usr/src/app

COPY / /usr/src/app/

RUN cd /usr/src/app/ &&\
  npm install --production

WORKDIR /usr/src/app

CMD node index.js

