// server.js
const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./data/database');

require('dotenv').config();

const session = require('express-session');
const passport = require('passport');
const configurePassport = require('./config/passport');

const app = express();
const port = process.env.PORT || 3000;

app.set('trust proxy', 1);

app.use(bodyParser.json());

app.use(
  session({
    secret: process.env.GITHUB_CLIENT_SECRET || 'dev_secret_change_me',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false 
    }
  })
);

configurePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use('/', require('./routes'));

mongodb.initDb((err) => {
  if (err) {
    console.error(err);
  } else {
    app.listen(port, () => {
      console.log(`Connected to DB and listening on ${port}`);
    });
  }
});
