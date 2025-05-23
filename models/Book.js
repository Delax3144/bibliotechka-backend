// backend/models/Book.js
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: { type: String },
  description: { type: String },
  rating: { type: Number, default: 0 },
  favoritedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  image: {
  type: String,
},
  ratings: [
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    value: Number,
    comment: String // ← теперь у нас есть текст
  }
]
});

module.exports = mongoose.model('Book', bookSchema);
