FROM surnet/alpine-node-wkhtmltopdf:14.16.0-0.12.6-full

#deployment
WORKDIR /src
COPY ./package*.json /src/

RUN npm install ts-node --save-dev npm install typescript -g  npm install typescript --save-dev


COPY ./ /src/

CMD npm start
