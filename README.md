# AFEX CHALLENGE (Serverless, AWS, NestJS, DynamoDB and Swagger)

## Technologies

- [AWS Lambda](https://aws.amazon.com/lambda)
- [AWS DynamoDB](https://aws.amazon.com/dynamodb)
- [Serverless](https://serverless.com/framework/docs/providers/aws/)
- [NestJS](https://docs.nestjs.com/)
- [NestJS Dynamoose](https://github.com/hardyscc/nestjs-dynamoose)

## Usage
 
```bash
git clone https://github.com/rogeranzoategui/-__afex_challenge__.git <Your_Project_Name>
cd <Your_Project_Name>

npm install
```

1. Copy `dotenv.example` in new `.env` file and replace with your custom values.

2. With the same `SERVICE` value declared in your `.env` file, find and replace `afex-challenge` on the following files:

- package.json
- serverless.yml

3. Copy `serverless-config-example.json` in new `serverless/config.dev.json` file and replace with your custom values, this is required for serveless deploy the `env` vars.


## Setup AWS Credentials

1. [Sign up for an AWS account](https://serverless.com/framework/docs/providers/aws/guide/credentials#sign-up-for-an-aws-account)

2. Login to your AWS account and go to the **Identity & Access Management (IAM)** page.

3. Click on **Users** and then **Add user**. Enter a name in the first field to remind you this User is related to the Serverless Framework, like `serverless-admin`. Enable **Programmatic access** by clicking the checkbox. Click **Next** to go through to the Permissions page. Click on **Attach existing policies directly**. Search for and select **AdministratorAccess** then click **Next: Review**. Check to make sure everything looks good and click **Create user**.

4. View and copy the **API Key & Secret** to a temporary place. You'll need it in the next step.

## Setup Workstation

### Install AWS CLI

- Windows: `choco install awscli`
- MacOS: `brew install awscli`

### Config AWS CLI

```bash
$ aws configure

AWS Access Key ID [****************TKYQ]:
AWS Secret Access Key [****************yNO2]:
Default region name [us-east-1]:
Default output format [None]:
```

> Please enter your **AWS Access Key ID**, **AWS Secret Access Key** and **Default region name**

## Deployment

```bash
# deploy to AWS
$ npm run deploy
```

## Install DynamoDB local

```bash
# download dynamodb local into .dynamodb folder
$ npm run ddb:install
```

## Local Offline Development

```bash
# start dynamodb local
$ npm run ddb:start

# start serverless-offline server
$ npm run sls:offline

# start serverless-offline server and connect to online dynamodb
$ npm run sls:online
```

## Local NestJS Development - (Optional)

```bash
# start dynamodb local
$ npm run ddb:start

# start local nestjs server
$ npm start

# start local nestjs server in watch mode
$ npm run start:watch

# start local nestjs server and connect to online dynamodb
$ npm run start:online
```

## Seed

```bash
# seed initial users, load from serverless/resources/
$ npm run ddb:seed
```
> In example file `serverless/resources/users-dev.json`, all passwords are `Test123`

## Unit Testing

```bash
# start dynamodb local
$ npm run ddb:start

# seed first (if dynamodb is empty)
$ npm run ddb:seed

# run unit test
$ npm test

# run unit test with coverage
$ npm run test:cov
```

## E2E Testing

```bash
# start dynamodb local
$ npm run ddb:start

# seed first (if dynamodb is empty)
$ npm run ddb:seed

# run unit test with coverage
$ npm run test:e2e
```

## API RESTful Endpoint Test

- offline: http://localhost:3000/dev/
- local: http://localhost:3000/api/
- AWS: https://<your_aws_deployment_id>.execute-api.<your_aws_region>.amazonaws.com/dev/

## Swagger Endpoint

- offline: http://localhost:3000/dev/doc
- local: http://localhost:3000/api/doc
- AWS: https://<your_aws_deployment_id>.execute-api.<your_aws_region>.amazonaws.com/dev/doc

