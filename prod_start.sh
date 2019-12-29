#This scripts start a mysql server and starts the api with valid credentials

export JWT_SECRET="ThisIsAVeryRandomStriung4907yAJIUSHahsduuwenh";
export DB_PASS="haskjdfhguuie9182347AS@";
export DB_ROOTPASS="AsiudhUYTA897y12yu98yuuihbbjikaBIHGYS*TY&*TgUOY98Y2HH";
export DB_NAME="users";

docker-compose -f DockerStuff/docker-compose.yml up
# docker-compose -f DockerStuff/docker-compose.yml stop
