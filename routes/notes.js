// routes/notes.js
const express = require('express');
const router = express.Router();

const notesController = require('../controllers/notes');
const validate = require('../middleware/validate');
const { isAuthenticated } = require('../middleware/authenticate');

const noteRules = {
  bookId: 'required|string',
  page: 'integer|min:1',
  quote: 'string',
  note: 'required|string'
};

router.get('/', notesController.getAll);
router.get('/:id', notesController.getSingle);

router.post('/', isAuthenticated, validate(noteRules), notesController.createNote);
router.put('/:id', isAuthenticated, validate(noteRules), notesController.updateNote);

router.delete('/:id', isAuthenticated, notesController.deleteNote);

module.exports = router;