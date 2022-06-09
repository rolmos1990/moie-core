FROM surnet/alpine-node-wkhtmltopdf:14.16.0-0.12.6-full

#FROM surnet/alpine-node-wkhtmltopdf:14.16.1-0.12.6-small

#Copy whtmltopdf
#COPY --from=wkhtmltopdf /bin/wkhtmltopdf /bin/wkhtmltopdf
#COPY --from=wkhtmltopdf /bin/wkhtmltoimage /bin/wkhtmltoimage
#COPY --from=wkhtmltopdf /bin/libwkhtmltox* /bin/

#RUN apk update freetype freetype-dev ttf-freefont

#RUN apk add --no-cache zlib fontconfig freetype libx11 libxext libxrender

#deployment
WORKDIR /src
COPY ./package*.json /src/
RUN npm install

COPY ./ /src/

EXPOSE 8888
CMD npm start
