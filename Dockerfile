FROM node:10

#deployment
WORKDIR /src
COPY ./package*.json /src/

RUN npm install


COPY ./ /src/

CMD [ "npm", "run", "start" ]
