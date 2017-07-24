import OAuthServer from 'express-oauth-server';
import express from 'express';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import memorystore from './lib/model';
import schema from './data/schema';

const bodyParser = require('body-parser');
const logger = require('./lib/logger');
const config = require('config');
const cors = require('cors');
const util = require('util');
const exphbs = require('express-handlebars');

const PORT = config.get('port');
const app = express();

app.engine('.hbs', exphbs({ extname: '.hbs', defaultLayout: 'main' }));
app.set('view engine', '.hbs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('*', cors());

app.oauth = new OAuthServer({
  model: memorystore,
  useErrorHandler: false,
  continueMiddleware: false,
});

// app.use((req, res, next) => {
//   console.log('req.method: ', req.method);
//   console.log('req.url: ', req.url);
//   console.log('req.headers: ', req.headers);
//   console.log('req.body: ', req.body);
//   next();
// });

// Post token.
app.post('/oauth/token', app.oauth.token({ accessTokenLifetime: 60 * 60 * 60 }));

app.get('/me', app.oauth.authenticate(), (req, res) => {
  const token = memorystore.getTokenFromRequestHeader(req);
  res.json(memorystore.getUserByToken(token, req.query.user_id));
});

// Post authorization.
app.post('/oauth/authorize', app.oauth.authorize());

app.get('/secure', app.oauth.authenticate(), (req, res) => {
  res.json({ message: 'Secure data' });
});

// Get login.
app.get('/login', (req, res) => {
  res.render('login', {
    redirect: req.query.redirect,
    client_id: req.query.client_id,
    client_secret: req.query.client_secret,
    redirect_uri: req.query.redirect_uri,
    grant_type: 'password',
  });
});

// Post login.
app.post('/login', (req, res) => {
  // @TODO: Insert your own login mechanism.
  if (req.body.email === '') {
    return res.render('login', {
      redirect: req.body.redirect,
      client_id: req.body.client_id,
      redirect_uri: req.body.redirect_uri,
    });
  }
  const path = req.body.redirect;
  return res.redirect(util.format('/%s?redirect=%s&client_id=%s&redirect_uri=%s', path, path, req.query.client_id, req.query.redirect_uri));
});

app.use('/graphql', graphqlExpress({
  schema,
}));

if (process.env.NODE_ENV === 'dev') {
  app.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql',
  }));
}

app.get('/', (req, res) => {
  memorystore.dump();
  res.render('home');
});


app.listen(PORT, () => {
  logger.log('info', `Running a OAuth server and GraphQL API at localhost:${PORT}/graphql`);
});
