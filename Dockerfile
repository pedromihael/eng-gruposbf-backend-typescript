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
RUN npm install --production
CMD npm run start:prod