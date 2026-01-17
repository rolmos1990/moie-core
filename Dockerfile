FROM surnet/alpine-node-wkhtmltopdf:14.16.0-0.12.6-full

# 🔐 Instalar CA certificates (si no están)
RUN apk add --no-cache ca-certificates

# 🔐 Copiar el certificado Sectigo
COPY certs/sectigopublirsa46.crt /usr/local/share/ca-certificates/

# 🔐 Actualizar trust store
RUN update-ca-certificates

ENV NODE_EXTRA_CA_CERTS=/etc/ssl/certs/ca-certificates.crt

#deployment
WORKDIR /src
COPY ./package*.json /src/
RUN npm install

ARG NODE_ENV=production

COPY ./ /src/

ENV NEW_RELIC_NO_CONFIG_FILE=true
ENV NEW_RELIC_DISTRIBUTED_TRACING_ENABLED=true
ENV NEW_RELIC_LOG=stdout

CMD ["node", "--max-old-space-size=512", "server.js"]
