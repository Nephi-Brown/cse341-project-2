const router = require('express').Router();
const passport = require('passport');
const { ensureAuth } = require('../middleware/auth');

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/auth/failure', session: true }),
  (req, res) => {
    res.redirect('/api-docs');
  }
);

router.get('/failure', (req, res) => {
  res.status(401).json({ error: 'GitHub login failed' });
});

router.get('/status', (req, res) => {
  res.status(200).json({
    authenticated: !!(req.isAuthenticated && req.isAuthenticated()),
    user: req.user || null
  });
});

router.get('/me', ensureAuth, (req, res) => {
  res.status(200).json({ user: req.user });
});

router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.status(200).json({ message: 'Logged out' });
  });
});

module.exports = router;
