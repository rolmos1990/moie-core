FROM surnet/alpine-node-wkhtmltopdf:14.16.0-0.12.6-full

#deployment
WORKDIR /src
COPY ./package*.json /src/
RUN npm install

# Install dependencies
RUN apk upgrade
RUN apk --update \
    add build-base \
    git \
    tzdata \
    nodejs \
    nodejs-npm \
    bash \
    curl \
    yarn \
    gzip \
    postgresql-client \
    postgresql-dev \
    imagemagick \
    imagemagick-dev \
    imagemagick-libs \
    chromium \
    chromium-chromedriver \
    ncurses \
    less \
    dpkg=1.19.7-r0 \
    chromium \
    chromium-chromedriver

RUN dpkg --add-architecture amd64
RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_i386.deb
RUN dpkg -i google-chrome-stable_current_i386.deb

COPY ./ /src/

ENV NEW_RELIC_NO_CONFIG_FILE=true

CMD npm start
