# Awesome Project Build with TypeORM (moie2)

Steps to run this project:

1. Run `npm i` command
2. Setup database settings inside `ormconfig.json` file
   1. Run `npm start` command

## MYSQL  test 4

    SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));
    SET SESSION sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));
    SET SQL_MODE = ''; 


## DOCKER UPLOAD

    docker build -t rolmos/moie-lucy-api .
    docker tag {TAG_VERSION} rolmos/moie-lucy-api
    docker push rolmos/moie-lucy-api


#RUN ON SERVER
   docker build -t rolmos/moie-lucy-api .

   docker run -e PORT=18211 \
   -e HOST=http://localhost \
   -e DB_HOST=3.85.198.54 \
   -e DB_PORT=3306 \
   -e DB_USERNAME=root \
   -e DB_DATABASE=moie-lucy-v2 \
   -e DB_PASSWORD=Panama2018. \
   -e SEED_DB=false \
   -e DIAN_USER=1CCC171F7911107313 \
   -e DIAN_PASSWORD=1CCC171F7911107313 \
   -e PUBLIC_URL=http://localhost:18211 \
   --name moie-lucy-api \
   -dp 18211:18211 rolmos/moie-lucy-api
