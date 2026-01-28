const ensureAuth = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) return next();

  return res.status(401).json({
    error: 'Unauthorized',
    message: 'Login required. Use /auth/github to sign in.'
  });
};

module.exports = { ensureAuth };
