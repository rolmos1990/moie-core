FROM node:14.18.0-alpine

#deployment
WORKDIR /src
COPY ./package*.json /src/
#COPY ./tsconfig.json /src/
#COPY ./yarn.lock /src/

RUN npm i -g ts-node@3.3.0
RUN npm i -g typescript@3.3.3333

COPY ./ /src/

RUN yarn

CMD [ "npm", "start" ]
EXPOSE 8080
