FROM surnet/alpine-node-wkhtmltopdf:14.16.0-0.12.6-full

#deployment
WORKDIR /src
COPY ./package*.json /src/
RUN npm install

COPY ./ /src/

ENV NEW_RELIC_NO_CONFIG_FILE=true

CMD npm start
