// routes/notes.js
const express = require('express');
const router = express.Router();

const notesController = require('../controllers/notes');
const validate = require('../middleware/validate');

const noteRules = {
  bookId: 'required|string',
  page: 'integer|min:1',
  quote: 'string',
  note: 'required|string'
};

router.get('/', notesController.getAll);
router.get('/:id', notesController.getSingle);

router.post('/', validate(noteRules), notesController.createNote);
router.put('/:id', validate(noteRules), notesController.updateNote);

router.delete('/:id', notesController.deleteNote);

module.exports = router;
