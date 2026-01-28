const express = require('express');
const router = express.Router();

const booksController = require('../controllers/books');
const validate = require('../middleware/validate');
const { ensureAuth } = require('../middleware/auth');

const bookRules = {
  title: 'required|string',
  author: 'required|string',
  isbn: 'string',
  genre: 'string',
  status: 'required|in:want-to-read,reading,finished',
  rating: 'integer|min:1|max:5',
  startDate: 'string',
  finishDate: 'string',
  tags: 'array'
};

router.get('/', booksController.getAll);
router.get('/:id', booksController.getSingle);

router.post('/', ensureAuth, validate(bookRules), booksController.createBook);
router.put('/:id', ensureAuth, validate(bookRules), booksController.updateBook);
router.delete('/:id', ensureAuth, booksController.deleteBook);

module.exports = router;
