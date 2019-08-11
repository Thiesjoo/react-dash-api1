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
    git \
    mysql-client
RUN npm install
# Rebuild bcrypt so it doesnt crash on hash
RUN npm rebuild bcrypt --build-from-source
#RUN apk del .gyp

# Copy the app source
COPY ./ .

EXPOSE 8080
CMD [ "npm", "start" ]