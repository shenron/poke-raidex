FROM shenron/yarn

# change user to install packages
USER root

RUN apk add imagemagick --update

USER node

ENV UHOME=/home/node/

# Install dependencies before add src to avoid install dependencies each time
RUN mkdir $UHOME/tmp
COPY package.json $UHOME/tmp/package.json
COPY yarn.lock $UHOME/tmp/yarn.lock

RUN mkdir $UHOME/app/.tmp

RUN cd $UHOME/tmp/ && \
  yarn install --frozen-lockfile --no-cache --production && \
  mv node_modules/ $UHOME/app/node_modules && \
  mv package.json $UHOME/app/package.json && \
  mv yarn.lock $UHOME/app/yarn.lock

COPY dist $UHOME/app/dist

USER root

RUN chown -R node:node $UHOME/app/.tmp/

USER node

WORKDIR $UHOME/app/

CMD yarn run serve --production

EXPOSE 3000
