FROM node:14.18.0-alpine

#deployment
WORKDIR /src
COPY ./package*.json /src/

RUN npm install

COPY ./ /src/

CMD npm start
