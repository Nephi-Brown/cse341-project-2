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

// Render is behind a proxy (HTTPS terminates before Node)
app.set('trust proxy', 1);

app.use(bodyParser.json());

// IMPORTANT: use a dedicated session secret (NOT your GitHub client secret)
if (!process.env.SESSION_SECRET) {
  console.warn(
    '⚠️ SESSION_SECRET is not set. Set it in Render env vars for production. Using a dev fallback is insecure.'
  );
}

app.use(
  session({
    name: 'sid',
    secret: process.env.SESSION_SECRET || 'dev_secret_change_me',
    resave: false,
    saveUninitialized: false,
    proxy: true, // helps when behind reverse proxies
    cookie: {
      httpOnly: true,
      // On Render (HTTPS) this should be true in production, or cookies may not persist reliably.
      secure: process.env.NODE_ENV === 'production',
      // OAuth callback is a top-level navigation; 'lax' is ideal for this.
      sameSite: 'lax',
      // Optional: 7 days
      maxAge: 1000 * 60 * 60 * 24 * 7
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
