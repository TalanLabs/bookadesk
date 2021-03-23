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

# Infra (with terraform)

Duplicate the file aws_credentials.sample and rename it aws_credentials.
In the new file, enter your AWS credentials.

To recreate the environment, type:
```bash
cd infra
# Get the execution plan
terraform plan
# run
terraform apply
```

Beware!!! The DynamoDB tables are managed by Terraform. Before applying, ensure they won't be replaced or destroyed.

To create a new environment, add a new item in the local.environment variable in the file main.tf

# Author

Made by Talan Labs - https://blog.talanlabs.com/