# Deprecated - use Dockerfile in root folder

FROM node:lts-alpine as build

WORKDIR /usr/src/app

COPY ./package*.json ./
COPY ./tsconfig*.json ./
RUN npm ci --quiet
COPY ./database.json ./database.json
COPY ./migrations ./migrations
COPY ./src ./src
RUN npm run build

FROM node:lts-alpine
WORKDIR /usr/src/app

ARG COMMIT_SHA=""

COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/migrations ./migrations
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/package.json ./
COPY --from=build /usr/src/app/database.json ./

RUN cat package.json | grep version | head -1 | awk -F= "{ print $2 }" | sed 's/[version:,\",]//g' | tr -d '[[:space:]]' >> version
RUN echo ".$COMMIT_SHA" >> version
RUN rm ./package.json

ENV PORT 8000
ENV NODE_ENV production
ENTRYPOINT [ "node", "dist/index.js" ]
