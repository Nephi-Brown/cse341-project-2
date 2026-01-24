// middleware/validate.js
const Validator = require('validatorjs');

/**
 * validate(rules)
 * Usage: router.post('/', validate(rules), controllerFn)
 */
const validate = (rules) => {
  return (req, res, next) => {
    const validation = new Validator(req.body, rules);

    if (validation.fails()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validation.errors.all()
      });
    }

    next();
  };
};

module.exports = validate;