export JWT_SECRET=LongJwtSecret;

docker start test-mongodb || docker run --name test-mongodb -d -p 27017:27017 -v `pwd`/mongoData:/data/db mongo
cd src
nodemon index.js
docker stop test-mongodb
