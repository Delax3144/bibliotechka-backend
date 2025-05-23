const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  addBook,
  getBooks,
  toggleFavorite,
  rateBook,
  getBookById // 👈 импортируем
} = require('../controllers/bookController');

// ➕ Добавить книгу (только авторизованные)
router.post('/', authMiddleware, addBook);

// 📚 Получить все книги (открытый)
router.get('/', getBooks);

// 📖 Получить одну книгу по ID с отзывами (открытый)
router.get('/:bookId', getBookById); // 👈 используем правильный контроллер

// 💖 Избранное (только авторизованные)
router.patch('/:bookId/favorite', authMiddleware, toggleFavorite);

// ⭐ Оценить книгу (только авторизованные)
router.post('/:bookId/rate', authMiddleware, rateBook);

module.exports = router;
