FROM node:16.20.2-alpine

WORKDIR /usr/app
COPY package.json ./
COPY yarn.lock ./
RUN yarn install
COPY . .
CMD yarn start:dev
