
const router = require('express').Router();
const passport = require('passport');

router.get(
  '/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/auth/failure', session: true }),
  (req, res) => {
    res.redirect('/api-docs');
  }
);

router.get('/success', (req, res) => {
  res.status(200).json({
    message: 'Logged in',
    user: req.user
  });
});

router.get('/failure', (req, res) => {
  res.status(401).json({ message: 'GitHub login failed' });
});

router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.status(200).json({ message: 'Logged out' });
  });
});

router.get('/status', (req, res) => {
  res.status(200).json({
    authenticated: !!(req.isAuthenticated && req.isAuthenticated()),
    user: req.user || null
  });
});

module.exports = router;
