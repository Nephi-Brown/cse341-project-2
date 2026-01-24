// controllers/books.js
const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');

const isValidObjectId = (id) => ObjectId.isValid(id);

// Helper: only save finishDate if it's not NA/empty
const normalizeFinishDate = (finishDate) => {
  if (finishDate === undefined || finishDate === null) return undefined;

  // Handle strings like "NA", "na", "N/A", "", "   "
  if (typeof finishDate === 'string') {
    const cleaned = finishDate.trim().toLowerCase();
    if (cleaned === '' || cleaned === 'na' || cleaned === 'n/a') return undefined;
    return finishDate.trim();
  }

  return finishDate;
};

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
    // Body is validated by validate.js middleware in routes/books.js

    const finishDate = normalizeFinishDate(req.body.finishDate);

    const book = {
      title: req.body.title,
      author: req.body.author,
      isbn: req.body.isbn,
      genre: req.body.genre,
      status: req.body.status,
      rating: req.body.rating,
      startDate: req.body.startDate,
      tags: req.body.tags
    };

    // ✅ Only store finishDate if it is valid
    if (finishDate !== undefined) {
      book.finishDate = finishDate;
    }

    // Business rule: rating only allowed when finished
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

    // Body is validated by validate.js middleware in routes/books.js

    const finishDate = normalizeFinishDate(req.body.finishDate);
    const bookId = new ObjectId(id);

    const book = {
      title: req.body.title,
      author: req.body.author,
      isbn: req.body.isbn,
      genre: req.body.genre,
      status: req.body.status,
      rating: req.body.rating,
      startDate: req.body.startDate,
      tags: req.body.tags
    };

    // ✅ Only store finishDate if it is valid
    if (finishDate !== undefined) {
      book.finishDate = finishDate;
    }

    // Business rule: rating only allowed when finished
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

    // Optional: remove related notes
    await mongodb.getDatabase().db().collection('notes').deleteMany({ bookId });

    const response = await mongodb.getDatabase().db().collection('books').deleteOne({ _id: bookId });

    if (response.deletedCount === 0) return res.status(404).json({ error: 'Book not found.' });

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete book.', details: err.message });
  }
};

module.exports = { getAll, getSingle, createBook, updateBook, deleteBook };
