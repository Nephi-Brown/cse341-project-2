// controllers/books.js
const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');

const isValidObjectId = (id) => ObjectId.isValid(id);

const getAll = async (req, res) => {
  // #swagger.tags = ['Books']
  try {
    const cursor = mongodb.getDatabase().db().collection('books').find();
    const books = await cursor.toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch books.', details: err.message });
  }
};

const getSingle = async (req, res) => {
  // #swagger.tags = ['Books']
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ error: 'Invalid book id.' });

    const bookId = new ObjectId(id);
    const book = await mongodb.getDatabase().db().collection('books').findOne({ _id: bookId });

    if (!book) return res.status(404).json({ error: 'Book not found.' });

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(book);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch book.', details: err.message });
  }
};

const createBook = async (req, res) => {
  // #swagger.tags = ['Books']
  try {
    // Body already validated by middleware
    const book = {
      title: req.body.title,
      author: req.body.author,
      isbn: req.body.isbn,
      genre: req.body.genre,
      status: req.body.status,
      rating: req.body.rating,
      startDate: req.body.startDate,
      finishDate: req.body.finishDate,
      tags: req.body.tags
    };

    // Optional business rule
    if (book.rating && book.status !== 'finished') {
      return res.status(400).json({ error: 'Rating is only allowed when status is "finished".' });
    }

    const response = await mongodb.getDatabase().db().collection('books').insertOne(book);

    if (response.acknowledged) {
      res.status(201).json({ insertedId: response.insertedId });
    } else {
      res.status(500).json({ error: 'Some error occurred while creating the book.' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to create book.', details: err.message });
  }
};

const updateBook = async (req, res) => {
  // #swagger.tags = ['Books']
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ error: 'Invalid book id.' });

    // Body already validated by middleware
    const bookId = new ObjectId(id);
    const book = {
      title: req.body.title,
      author: req.body.author,
      isbn: req.body.isbn,
      genre: req.body.genre,
      status: req.body.status,
      rating: req.body.rating,
      startDate: req.body.startDate,
      finishDate: req.body.finishDate,
      tags: req.body.tags
    };

    if (book.rating && book.status !== 'finished') {
      return res.status(400).json({ error: 'Rating is only allowed when status is "finished".' });
    }

    const response = await mongodb.getDatabase().db().collection('books').replaceOne(
      { _id: bookId },
      book
    );

    if (response.matchedCount === 0) return res.status(404).json({ error: 'Book not found.' });

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to update book.', details: err.message });
  }
};

const deleteBook = async (req, res) => {
  // #swagger.tags = ['Books']
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ error: 'Invalid book id.' });

    const bookId = new ObjectId(id);

    // Optional: delete related notes too (helps keep DB clean)
    await mongodb.getDatabase().db().collection('notes').deleteMany({ bookId });

    const response = await mongodb.getDatabase().db().collection('books').deleteOne({ _id: bookId });

    if (response.deletedCount === 0) return res.status(404).json({ error: 'Book not found.' });

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete book.', details: err.message });
  }
};

module.exports = { getAll, getSingle, createBook, updateBook, deleteBook };