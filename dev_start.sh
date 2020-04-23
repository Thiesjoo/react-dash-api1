#!/usr/bin/env bash

exit_commands() {
    printf "\rSIGINT caught. Stopping docker container \n"
    docker stop test-mongodb
    exit
}

trap 'exit_commands' SIGINT

export JWT_SECRET=LongJwtSecret;

docker start test-mongodb || docker run --name test-mongodb -d -p 27017:27017 -v `pwd`/mongoData:/data/db mongo
cd src
nodemon index.js
