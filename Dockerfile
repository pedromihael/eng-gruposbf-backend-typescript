# build stage
FROM node:16.20.2-alpine as build-stage
WORKDIR /usr/app
COPY package.json ./
COPY yarn.lock ./
COPY . .
RUN yarn install
RUN yarn build

# run stage
FROM node:16.20.2-alpine as production-stage
WORKDIR /usr/app
COPY --from=build-stage ./usr/app/build ./build
COPY package* ./
EXPOSE 3000

ENV MONGODB_USERNAME root

ARG mongo_url
ENV MONGODB_URL $mongo_url

ARG mongo_password
ENV MONGODB_PASSWORD $mongo_password

ARG fixer_accesskey
ENV FIXERIO_ACCESSKEY $fixer_accesskey

RUN npm install --production
CMD node ./build/index.js