FROM node:14.18.1-alpine

#deployment
WORKDIR /src

COPY package*.json ./
RUN npm install
COPY . .

RUN npm i -g ts-node@3.3.0
RUN npm i -g typescript@3.3.3333

CMD [ "npm", "run", "start" ]
EXPOSE 8080
