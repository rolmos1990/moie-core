FROM surnet/alpine-node-wkhtmltopdf:14.16.0-0.12.6-full

#deployment
WORKDIR /src
COPY ./package*.json /src/
RUN npm install

ARG NODE_ENV=production

COPY ./ /src/

ENV NEW_RELIC_NO_CONFIG_FILE=true
ENV NEW_RELIC_DISTRIBUTED_TRACING_ENABLED=true \
NEW_RELIC_LOG=stdout

CMD npm start
