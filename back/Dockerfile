FROM node:12

USER node

ENV UHOME=/home/node/

# Install dependencies before add src to avoid install dependencies each time
RUN mkdir $UHOME/tmp
COPY package.json $UHOME/tmp/package.json
COPY package-lock.json $UHOME/tmp/package-lock.json

RUN mkdir -p $UHOME/app/.tmp

RUN cd $UHOME/tmp/ && \
  npm ci --production && \
  mv node_modules/ $UHOME/app/node_modules && \
  mv package.json $UHOME/app/package.json && \
  mv package-lock.json $UHOME/app/package-lock.json

COPY dist $UHOME/app/dist

USER root

RUN chown -R node:node $UHOME/app/.tmp/

USER node

WORKDIR $UHOME/app/

CMD npm run serve --production

EXPOSE 3000
