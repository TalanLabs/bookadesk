ARG current_version

FROM node:lts-alpine as build

ARG current_version
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

ARG current_version

COPY --from=build /usr/src/app/back/node_modules ./node_modules
COPY --from=build /usr/src/app/back/package.json ./
COPY --from=build /usr/src/app/back/database.json ./
COPY --from=build /usr/src/app/back/migrations ./migrations
COPY --from=build /usr/src/app/back/dist ./dist

RUN rm ./package.json

ENV VERSION=$current_version
ENV PORT 8000
ENV NODE_ENV production
ENV SERVE_FRONT true

ENTRYPOINT [ "node", "dist/index.js" ]

