
const ensureAuth = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }

  return res.status(401).json({
    error: 'Unauthorized',
    message: 'You must be logged in with GitHub to access this resource.'
  });
};

module.exports = { ensureAuth };
