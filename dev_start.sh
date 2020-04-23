#!/usr/bin/env bash
exit_commands() {
    printf "\rSIGINT caught. Stopping docker container \n"
    docker stop test-mongodb
    exit
}

trap 'exit_commands' SIGINT

export JWT_SECRET=LongJwtSecret;

#For persistent database add this to end of nextline(Without quotes). "-v `pwd`/mongoData:/data/db"
docker start test-mongodb || docker run --name test-mongodb -d -p 27017:27017 mongo
nodemon src/app.js
