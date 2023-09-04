# build stage
FROM node:16.20.2-alpine as build-stage
WORKDIR /usr/app
COPY package.json ./
COPY yarn.lock ./
COPY . .
ENV MONGODB_URL $MONGODB_URL
ENV MONGODB_USERNAME root
ENV MONGODB_PASSWORD $MONGODB_PASSWORD
ENV FIXERIO_ACCESSKEY $FIXERIO_ACCESSKEY
RUN yarn install
RUN yarn build

# run stage
FROM node:16.20.2-alpine as production-stage
WORKDIR /usr/app
COPY --from=build-stage ./usr/app/build ./build
COPY package* ./
EXPOSE 3000
ENV MONGODB_URL $MONGODB_URL
ENV MONGODB_USERNAME root
ENV MONGODB_PASSWORD $MONGODB_PASSWORD
ENV FIXERIO_ACCESSKEY $FIXERIO_ACCESSKEY
RUN npm install --production
CMD node ./build/index.js