// controllers/notes.js
const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');

const isValidObjectId = (id) => ObjectId.isValid(id);

const getAll = async (req, res) => {
  // #swagger.tags = ['Notes']
  try {
    const cursor = mongodb.getDatabase().db().collection('notes').find();
    const notes = await cursor.toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(notes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notes.', details: err.message });
  }
};

const getSingle = async (req, res) => {
  // #swagger.tags = ['Notes']
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ error: 'Invalid note id.' });

    const noteId = new ObjectId(id);
    const note = await mongodb.getDatabase().db().collection('notes').findOne({ _id: noteId });

    if (!note) return res.status(404).json({ error: 'Note not found.' });

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(note);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch note.', details: err.message });
  }
};

const createNote = async (req, res) => {
  // #swagger.tags = ['Notes']
  try {
    // Body already validated by middleware
    const { bookId, page, quote, note } = req.body;

    if (!isValidObjectId(bookId)) return res.status(400).json({ error: 'Invalid bookId.' });

    const bookObjectId = new ObjectId(bookId);
    const bookExists = await mongodb.getDatabase().db().collection('books').findOne({ _id: bookObjectId });
    if (!bookExists) return res.status(404).json({ error: 'Book not found for provided bookId.' });

    const noteDoc = {
      bookId: bookObjectId, // store as ObjectId
      page,
      quote,
      note
    };

    const response = await mongodb.getDatabase().db().collection('notes').insertOne(noteDoc);

    if (response.acknowledged) {
      res.status(201).json({ insertedId: response.insertedId });
    } else {
      res.status(500).json({ error: 'Some error occurred while creating the note.' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to create note.', details: err.message });
  }
};

const updateNote = async (req, res) => {
  // #swagger.tags = ['Notes']
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ error: 'Invalid note id.' });

    // Body already validated by middleware
    const { bookId, page, quote, note } = req.body;

    if (!isValidObjectId(bookId)) return res.status(400).json({ error: 'Invalid bookId.' });

    const bookObjectId = new ObjectId(bookId);
    const bookExists = await mongodb.getDatabase().db().collection('books').findOne({ _id: bookObjectId });
    if (!bookExists) return res.status(404).json({ error: 'Book not found for provided bookId.' });

    const noteId = new ObjectId(id);
    const noteDoc = {
      bookId: bookObjectId,
      page,
      quote,
      note
    };

    const response = await mongodb.getDatabase().db().collection('notes').replaceOne(
      { _id: noteId },
      noteDoc
    );

    if (response.matchedCount === 0) return res.status(404).json({ error: 'Note not found.' });

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to update note.', details: err.message });
  }
};

const deleteNote = async (req, res) => {
  // #swagger.tags = ['Notes']
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ error: 'Invalid note id.' });

    const noteId = new ObjectId(id);
    const response = await mongodb.getDatabase().db().collection('notes').deleteOne({ _id: noteId });

    if (response.deletedCount === 0) return res.status(404).json({ error: 'Note not found.' });

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete note.', details: err.message });
  }
};

module.exports = { getAll, getSingle, createNote, updateNote, deleteNote };
