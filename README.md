
# Instapic-api

RESTful API server for photo sharing site Instapic


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file (see .env.example)

```
DATABASE_URL=
ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=
PORT=
COOKIE_SECRET=
CORS_ORIGIN=
BUCKET_NAME=
```

Google service worker key is also required for local environment, you can set the path of keys at

`GOOGLE_APPLICATION_CREDENTIALS=`

## Installation

```bash
$ yarn
```

## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

  
## Tech Stack

**Server:** Node, Nest.js, jest, typeorm, google cloud storage, Postgres

  
## API Reference

See the swagger hub at `{endpoint}/api` or https://instapic-api.jackeylau.com/api/

## Architecture

![instapic](https://user-images.githubusercontent.com/20975443/129932345-e778dfdb-e0bc-4f49-bc74-2b234860e58f.jpeg)


## Lessons Learned

- Using Nest.js framework to build scalable Node.js project
- Dependency Injection
- Unit testing with mockings


