// backend/controllers/bookController.js
const Book = require('../models/Book');

const addBook = async (req, res) => {
  try {
    const book = new Book(req.body);
    await book.save();
    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getBooks = async (req, res) => {
  const { author, genre } = req.query;
  const filter = {};

  if (author) filter.author = new RegExp(author, 'i');
  if (genre) filter.genre = new RegExp(genre, 'i');

  try {
    const books = await Book.find(filter);
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



const toggleFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bookId } = req.params;

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Książka nie znaleziona' });

    // Проверяем, есть ли уже пользователь в избранных
    const alreadyFavorited = book.favoritedBy.some(
      (id) => id.toString() === userId
    );

    if (alreadyFavorited) {
      book.favoritedBy = book.favoritedBy.filter(
        (id) => id.toString() !== userId
      );
    } else {
      book.favoritedBy.push(userId);
    }

    await book.save();
    res.json({ message: 'Zaktualizowano ulubione', favoritedBy: book.favoritedBy });
  } catch (err) {
    console.error("toggleFavorite error:", err);
    res.status(500).json({ message: 'Błąd serwera', error: err.message });
  }
};


const rateBook = async (req, res) => {
  const userId = req.user.id.toString(); 
  const { bookId } = req.params;
  const { value, comment } = req.body; // 👈 добавили comment

  if (!value || value < 1 || value > 5) {
    return res.status(400).json({ message: 'Ocena musi być w zakresie 1–5' });
  }

  try {
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Książka nie znaleziona' });

    const existingRating = book.ratings.find(r => r.userId.toString() === userId);

    if (existingRating) {
      existingRating.value = value;
      existingRating.comment = comment; // 👈 сохраняем текст
    } else {
      book.ratings.push({ userId, value, comment }); // 👈 сохраняем новый текст
    }

    const total = book.ratings.reduce((sum, r) => sum + r.value, 0);
    book.rating = total / book.ratings.length;

    await book.save();
    res.json({ message: 'Ocena zapisana', rating: book.rating });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId)
      .populate('ratings.userId', 'username'); // 👈 имя пользователя

    if (!book) return res.status(404).json({ message: 'Książka nie znaleziona' });

    res.json(book);
  } catch (err) {
    res.status(500).json({ message: 'Błąd serwera', error: err.message });
  }
};


module.exports = {
  addBook,
  getBooks,
  toggleFavorite,
  rateBook,
  getBookById
};
