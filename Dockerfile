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

ENV MONGO_USERNAME root

ARG mongo_url
ENV MONGO_URL $mongo_url

ARG mongo_password
ENV MONGO_PASSWORD $mongo_password

ARG fixer_accesskey
ENV FIXERIO_ACCESSKEY $fixer_accesskey

ARG redis_url
ENV REDIS_URL $redis_url

RUN npm install --production
CMD node ./build/index.js