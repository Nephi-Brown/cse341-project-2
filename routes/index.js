// routes/index.js
const router = require('express').Router();

router.use('/', require('./swagger'));

router.get('/', (req, res) => {
  //#swagger.tags=['Hello World']
  res.send('Hello World');
});

router.use('/books', require('./books'));
router.use('/notes', require('./notes'));

module.exports = router;
