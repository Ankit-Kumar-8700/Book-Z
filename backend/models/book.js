import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  genre: {
    type: String,
    required: true
  },
  picPath: {
    type: String,
    required: true
  },
  yearPublished: {
    type: Number,
    required: true
  }
});

const Book = mongoose.model('Book', bookSchema);

export default Book;
