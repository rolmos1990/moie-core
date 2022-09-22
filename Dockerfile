FROM node:14.18.0-alpine

#deployment
WORKDIR /src
COPY ./package*.json /src/
#COPY ./tsconfig.json /src/
#COPY ./yarn.lock /src/

COPY ./ /src/

RUN yarn

CMD [ "npm", "start" ]
EXPOSE 8080
