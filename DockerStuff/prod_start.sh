#This scripts start a mysql server and starts the api with valid credentials

export JWT_SECRET="ThisIsAVeryRandomStriung4907yAJIUSHahsduuwenh";

docker pull dashboardinfo/api1:latest
docker-compose -f DockerStuff/docker-compose.yml up
# docker-compose -f DockerStuff/docker-compose.yml stop
