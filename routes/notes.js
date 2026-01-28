const express = require('express');
const router = express.Router();

const notesController = require('../controllers/notes');
const validate = require('../middleware/validate');
const { ensureAuth } = require('../middleware/auth');

const noteRules = {
  bookId: 'required|string',
  page: 'integer|min:1',
  quote: 'string',
  note: 'required|string'
};

router.get('/', notesController.getAll);
router.get('/:id', notesController.getSingle);

router.post('/', ensureAuth, validate(noteRules), notesController.createNote);
router.put('/:id', ensureAuth, validate(noteRules), notesController.updateNote);
router.delete('/:id', ensureAuth, notesController.deleteNote);

module.exports = router;
