const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const mongodb = require('../data/database');

const ensureEnv = () => {
  const required = ['GITHUB_CLIENT_ID', 'GITHUB_CLIENT_SECRET', 'GITHUB_CALLBACK_URL'];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length) {
    throw new Error(`Missing env vars: ${missing.join(', ')}`);
  }
};

const configurePassport = () => {
  ensureEnv();

  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const db = mongodb.getDatabase().db();
          const users = db.collection('users');
          const githubId = profile.id;
          const username = profile.username || null;
          const displayName = profile.displayName || null;
          const profileUrl = profile.profileUrl || null;
          const provider = profile.provider || 'github';
          const existing = await users.findOne({ githubId });

          if (!existing) {
            const newUser = {
              githubId,
              username,
              displayName,
              profileUrl,
              provider,
              createdAt: new Date(),
              lastLogin: new Date()
            };

            const insertResult = await users.insertOne(newUser);
            return done(null, { _id: insertResult.insertedId, ...newUser });
          }

          await users.updateOne(
            { _id: existing._id },
            {
              $set: {
                username,
                displayName,
                profileUrl,
                lastLogin: new Date()
              }
            }
          );

          return done(null, existing);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, { _id: user._id, githubId: user.githubId, username: user.username });
  });

  passport.deserializeUser(async (sessionUser, done) => {
    try {
      const db = mongodb.getDatabase().db();
      const user = await db.collection('users').findOne({ _id: sessionUser._id });
      done(null, user || null);
    } catch (err) {
      done(err, null);
    }
  });
};

module.exports = configurePassport;
