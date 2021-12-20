# Awesome Project Build with TypeORM

Steps to run this project:

1. Run `npm i` command
2. Setup database settings inside `ormconfig.json` file
   1. Run `npm start` command

## MYSQL

    SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));
    SET SESSION sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));
    SET SQL_MODE = '';


## DOCKER UPLOAD

    docker build -t rolmos/moie-lucy-api .
    docker tag {TAG_VERSION} rolmos/moie-lucy-api
    docker push rolmos/moie-lucy-api


#RUN ON SERVER

    docker run \
    -dp \
    --name moie-core \
    -e PORT=18210 \
    -e HOST=http://localhost \
    -e DB_HOST=localhost \
    -e DB_PORT=6603 \
    -e DB_USERNAME=root \
    -e DB_PASSWORD=root \
    -e DB_DATABASE=moie-lucy-v2 \
    -e SEED_DB=true \
    -e DIAN_USER=1CCC171F7911107313 \
    -e DIAN_PASSWORD=1CCC171F7911107313
