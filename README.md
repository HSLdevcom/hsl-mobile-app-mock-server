# express-graphql-oauth-mock-server
* GraphQL part is based on https://github.com/eddyerburgh/express-graphql-boilerplate
* OAuth part is based on https://github.com/oauthjs/express-oauth-server

This is used to test OAuth login and GraphQL queries/mutations in [hsl-mobile-app](https://github.com/HSLdevcom/hsl-mobile-app)

__NOTE: OAuth logic has only in memory implementation at the moment__

## Features

* Express server
* GraphQL
* GraphQl tools
* OAuth Server with password grant login
  * Currently only in memory implementation, see `lib/model.js`
  * Based on https://github.com/oauthjs/node-oauth2-server/blob/master/docs/model/spec.rst
* eslint with airbnb's config
* winston logger

## Installation

```
npm install
```

```
yarn install
```

## Usage

### "Production"

Build
* `npm run build`

Start the server
```
npm start
```
```
yarn start
```

The server will be running at http://localhost:4000/graphql/

Example query:
```shell
curl -X POST \
-H "Content-Type: application/json" \
-d '{"query": "{ posts { id } }"}' \
http://localhost:4000/graphql
```

### Dev

Start the server

```
npm run dev
```

```
yarn run dev
```

GraphiQL will be running at http://localhost:4000/graphiql/
