Desk booking application

# How to build and run locally

To access the DynamoDB database on AWS, please request an account at nicolas.sauvage@talan.com

## Backend

Create a `.env` file in `/back`, and add the following variables with your AWS credentials 

```bash
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
NODE_ENV=dev
```

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

# Setup Git hooks

`git config core.hooksPath .githooks`

# Database migrations

To add a new migration use db-migrate to create the SQL files

```bash
npx db-migrate create <MIGRATION_NAME> --sql-file
```

# Author

Made by Talan Labs - https://blog.talanlabs.com/