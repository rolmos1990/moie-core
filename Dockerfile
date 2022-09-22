FROM surnet/alpine-node-wkhtmltopdf:14.16.0-0.12.6-full

#deployment
WORKDIR /src
COPY ./package*.json /src/
COPY ./tsconfig.json /src/
COPY ./ /src/

RUN npm install

EXPOSE 8080
CMD [ "node", "server.ts" ]
