Desk booking application

# Deploy

## Run with Docker

Copy the .env.docker file to edit according to your configuration

```bash
 docker run --env-file .env.docker -p 8000:8000 -v ${PWD}/bookadesk_images:/usr/src/app/images public.ecr.aws/t6p3t0v4/talan-bookadesk:latest
```

## Configure Keycloak

In a new or existing realm in Keycloak, add a *desk-booking-front* client, do not forget to set a valid redirect uri such as http://myapp/* and a "Web Origin" such as http://myapp.
Add an "admin" role to this client.

Create a *desk-booking-back* client, with type bearer-only

Copy the realm name to the environment variable KEYCLOAK_REALM and the realm public key to KEYCLOAK_REALM_PUBLIC_KEY

## Configuration - backend environment variables

- HIDE_PLANS: do not show floor plans, hides the show/hide button too 

# How to build and run locally

## Database

The backend will need a Postgres database named `bookadesk` to run.

You can start one with the following docker command:

```bash
docker run -p 5432:5432 -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=bookdadesk --name pg-bookadesk postgres:14
```

## Backend

In `back` folder

Create a `.env` file in `/back`, see `.env.example` file.
Fill Keycloak variables

Run `npm install`

Run the backend with `npm start`

## Frontend (webapp)

Create a `.env.local` file in `/front`, and set VUE_APP_API_URL to the backend local url 

```bash
cd front
# install
npm install
# run
npm run serve
```

## Setup Git hooks

`git config core.hooksPath .githooks`

## Build and run with Docker

```bash
docker build -t bookadesk .   
docker run --env-file .env.docker -p 8000:8000 -v ${PWD}/tmp:/usr/src/app/images bookadesk
```

# Database migrations

To add a new migration use db-migrate to create the SQL files

```bash
npx db-migrate create <MIGRATION_NAME> --sql-file
```

# Credits

Bin icon by <a href="https://freeicons.io/profile/3335">visuallanguage</a> on <a href="https://freeicons.io">freeicons.io</a>

# Author

Made by Talan Labs - https://blog.talanlabs.com/
