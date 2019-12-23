FROM node:12-alpine

# Create app directory
WORKDIR /usr/src/api1

COPY ./package*.json ./

RUN npm install --production

# Copy the app source
COPY ./ .

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait
RUN chmod +x /wait

EXPOSE 8080
CMD /wait && npm start