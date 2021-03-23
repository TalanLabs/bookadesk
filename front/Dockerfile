FROM node:lts-alpine as build

# make the 'app' folder the current working directory
WORKDIR /app

# copy both 'package.json' and 'package-lock.json' (if available)
COPY package*.json ./

# copy project files and folders to the current working directory (i.e. 'app' folder)
COPY ./ ./

# install project dependencies
RUN npm install
# build app for production with minification
RUN npm run build --production

FROM nginx:stable-alpine
WORKDIR /usr/share/nginx/html

COPY --from=build /app/dist ./

# Substitute config with environment variables values before running
# CMD envsubst < ./environment.template.js > ./environment.js && exec nginx -g 'daemon off;'
