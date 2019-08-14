FROM node:12-alpine

# Create app directory
WORKDIR /usr/src/api1

COPY ./package*.json ./

# Install app dependencies (All this apk stuff is needed to build bcrypt succesfully.) 
# FIXME: Find a better alternative for this
RUN apk add --virtual .gyp \
    autoconf \
    automake \
    g++ \
    libpng-dev \
    libtool \
    make \
    nasm \
    python \
    git 
RUN npm install
# Rebuild bcrypt so it doesnt crash on hash
RUN npm rebuild bcrypt --build-from-source

# Copy the app source
COPY ./ .

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait
RUN chmod +x /wait

EXPOSE 8080
CMD /wait && npm start