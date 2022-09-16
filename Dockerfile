FROM surnet/alpine-node-wkhtmltopdf:14.16.0-0.12.6-full

#deployment
WORKDIR /src
COPY ./package*.json /src/

RUN npm install --save @types/node@latest ts-node@latest --force

COPY ./ /src/

CMD npm start
