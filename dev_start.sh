#This scripts start a mysql server and starts the api with valid credentials

export JWT_SECRET=test;
export DB_PASS=test1;
export DB_ROOTPASS=test2;
export DB_NAME=users_test;

docker start test-mysql || docker run --name test-mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=$DB_ROOTPASS -e MYSQL_DATABASE=$DB_NAME -e MYSQL_USER=nodejs -e MYSQL_PASSWORD=$DB_PASS -d mysql:latest --default-authentication-plugin=mysql_native_password
nodemon
docker stop test-mysql
