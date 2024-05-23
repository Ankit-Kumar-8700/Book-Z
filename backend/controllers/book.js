import Book from "../models/book.js";
import User from "../models/user.js";

/* CREATE */
export const createBook = async (req, res) => {
  try {
    let { userId, title, author, genre, data, yearPublished } = req.body;
    const user = await User.findById(userId);

    if(typeof(data)!=="string" && typeof(data)!=="undefined") data=data[0];
        // console.log(data);

    const newBook = new Book({
      userId,
      username: user.name,
      title,
      author,
      genre,
      picPath:data,
      yearPublished,
    });
    await newBook.save();

    res.status(201).json({book:newBook});
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

/* READ */
export const getBooks = async (req, res) => {
  try {
    console.log(req.params);
    let currGenre = req.params.currGenre || "All";
    let page = req.params.currPage || 1;
    const query = req.query.q;
    let searchConditions = [];
    if (query) {
      searchConditions.push(
        { title: new RegExp(query, 'i') },
        { author: new RegExp(query, 'i') }
      );
    }
    const filter = currGenre!=="All" ? query ? { $and: [{ genre: currGenre }, { $or: searchConditions }] } : {genre: currGenre} : query ? { $or: searchConditions} : {};
    const limit=12;
    const books = await Book.find(filter)
    .sort({ yearPublished: -1 }) // Sort by yearPublished in descending order
    .limit(limit) // Limit the number of books returned
    .skip((page - 1) * limit) // Skip books to get to the correct page
    .exec(); // Execute the query

    const count = await Book.countDocuments(filter); // Get total number of books

    res.status(201).json({books, totalBooks: count, page, totalPages: Math.ceil(count / limit)});
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);
    if(!book){
      return res.status(404).json({message:"Book not found."})
    }
    res.status(200).json({book});
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const book=await Book.findById(id);
    if(!book){
        return res.status(404).json({message: "Book not found."})
    }
    if(book.userId!==userId) {
      return res.status(400).json({message: "You can't delete other user's book."})
    }
    await Book.findByIdAndDelete( id );

    let currGenre = req.body.currGenre || "All";
    let page = req.body.currPage || 1;
    const query = req.query.q;
    let searchConditions = [];
    if (query) {
      searchConditions.push(
        { title: new RegExp(query, 'i') },
        { author: new RegExp(query, 'i') }
      );
    }
    const filter = currGenre!=="All" ? query ? { $and: [{ genre: currGenre }, { $or: searchConditions }] } : {genre: currGenre} : query ? { $or: searchConditions} : {};
    const limit=12;
    const count = await Book.countDocuments(filter); // Get total number of books
    page=Math.min(page,Math.ceil(count / limit));
    const books = await Book.find(filter)
    .sort({ yearPublished: -1 }) // Sort by yearPublished in descending order
    .limit(limit) // Limit the number of books returned
    .skip((page - 1) * limit) // Skip books to get to the correct page
    .exec(); // Execute the query


    res.status(201).json({books, totalBooks: count, page:Math.min(page,Math.ceil(count / limit)), totalPages: Math.ceil(count / limit)});
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, title, author, genre, yearPublished } = req.body;
    const book=await Book.findById(id);
    if(!book){
        return res.status(404).json({message: "Book not found."})
    }
    if(book.userId!==userId) {
      return res.status(400).json({message: "You can't update other user's book."})
    }
    
    book.title=title;
    book.author=author;
    book.genre=genre;
    book.yearPublished=yearPublished;

    await book.save();
    res.status(201).json({book:book});
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};