FROM node:14.18.1-alpine

#deployment
WORKDIR /src

COPY ./ /src/
COPY ./package.json /src/
COPY ./tsconfig.json /src/
#COPY ./yarn.lock /src/

RUN npm i -g ts-node@3.3.0
RUN npm i -g typescript@3.3.3333
RUN npm cache clean -f

RUN npm install

CMD [ "npm", "start" ]
EXPOSE 8080
