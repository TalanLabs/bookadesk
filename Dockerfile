FROM node:lts-alpine as build

WORKDIR /usr/src/app/front

COPY ./front/package*.json ./
COPY ./front/tsconfig*.json ./
RUN npm ci --quiet
COPY ./front/src ./src
COPY ./front/public ./public
COPY ./front/.eslintrc.js ./
COPY ./front ./

RUN npm run build

WORKDIR /usr/src/app/back

COPY ./back/package*.json ./
RUN npm ci --quiet
COPY ./back/tsconfig.json ./
COPY ./back/database.json ./
COPY ./back/migrations ./migrations
COPY ./back/src ./src
RUN npm run build

FROM node:lts-alpine

WORKDIR /usr/src/app/front
COPY --from=build /usr/src/app/front/dist ./dist
RUN npm i -g serve

WORKDIR /usr/src/app/back

ARG COMMIT_SHA=""

COPY --from=build /usr/src/app/back/node_modules ./node_modules
COPY --from=build /usr/src/app/back/package.json ./
COPY --from=build /usr/src/app/back/database.json ./
COPY --from=build /usr/src/app/back/migrations ./migrations
COPY --from=build /usr/src/app/back/dist ./dist

RUN cat package.json | grep version | head -1 | awk -F= "{ print $2 }" | sed 's/[version:,\",]//g' | tr -d '[[:space:]]' >> version
RUN echo ".$COMMIT_SHA" >> version
RUN rm ./package.json

ENV PORT 8000
ENV NODE_ENV production
ENV SERVE_FRONT true

ENTRYPOINT [ "node", "dist/index.js" ]
