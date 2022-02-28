FROM node:lts-alpine

WORKDIR /usr/code
COPY . .
RUN npm i
