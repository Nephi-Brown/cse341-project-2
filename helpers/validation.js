// helpers/validation.js
const:contentReference[oaicite:10]{index=10}'validatorjs');

const validate = (data, rules) => {
  const validation = new Validator(data, rules);

  return {
    passes: validation.passes(),
    errors: validation.errors.all()
  };
};

module.exports = { validate };