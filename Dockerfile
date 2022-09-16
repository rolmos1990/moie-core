FROM dporganizer/alpine-node-yarn:14.16.0

#deployment
WORKDIR /src
COPY ./package*.json /src/

RUN yarn

COPY ./ /src/

CMD npm start
