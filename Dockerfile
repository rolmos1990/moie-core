FROM surnet/alpine-wkhtmltopdf:3.9-0.12.5-full as wkhtmltopdf
FROM node:14-alpine

#FROM surnet/alpine-node-wkhtmltopdf:14.16.1-0.12.6-small

#Copy whtmltopdf
COPY --from=wkhtmltopdf /bin/wkhtmltopdf /bin/wkhtmltopdf
COPY --from=wkhtmltopdf /bin/wkhtmltoimage /bin/wkhtmltoimage
COPY --from=wkhtmltopdf /bin/libwkhtmltox* /bin/

RUN apk update freetype freetype-dev ttf-freefont

#deployment
WORKDIR /src
COPY ./package*.json /src/
RUN npm install

COPY ./ /src/

# FROM node:14-alpine
#RUN apk add curl
#RUN curl -L https://github.com/wkhtmltopdf/wkhtmltopdf/releases/download/0.12.4/wkhtmltox-0.12.4_linux-generic-amd64.tar.xz | tar -xJ
#RUN mv wkhtmltox /usr/local/bin/wkhtmltopdf

EXPOSE 8888
CMD npm start
