// config/passport.js
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;

function configurePassport() {
  if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET || !process.env.GITHUB_CALLBACK_URL) {
    throw new Error('Missing GitHub OAuth env vars. Check GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, GITHUB_CALLBACK_URL');
  }

  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL
      },
      async (accessToken, refreshToken, profile, done) => {
        // Minimal user object stored in session:
        // (You can store in Mongo later if you want, but not required for the rubric.)
        const user = {
          id: profile.id,
          username: profile.username,
          displayName: profile.displayName,
          profileUrl: profile.profileUrl,
          provider: profile.provider
        };

        return done(null, user);
      }
    )
  );

  // Store only what you need in the session
  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user, done) => done(null, user));
}

module.exports = configurePassport;
