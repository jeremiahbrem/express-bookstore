const express = require("express");
const Book = require("../models/book");
const jsonschema = require("jsonschema");
const bookSchema = require("../schemas/bookSchema.json")
const ExpressError = require("../expressError")

const router = new express.Router();


/** GET / => {books: [book, ...]}  */

router.get("/", async function (req, res, next) {
  try {
    const books = await Book.findAll();
    return res.json({ books });
  } catch (err) {
    return next(err);
  }
});

/** GET /[isbn]  => {book: book} */

router.get("/:isbn", async function (req, res, next) {
  try {
    const book = await Book.findOne(req.params.isbn);
    return res.json({ book });
  } catch (err) {
    return next(err);
  }
});

/** POST /   bookData => {book: newBook}  */

router.post("/", async function (req, res, next) {
  try {
    const result = jsonschema.validate(req.body, bookSchema);

    if (!result.valid) {
      let listOfErrors = result.errors.map(error => error.stack);
      let error = new ExpressError(listOfErrors, 400);
      return next(error);
    }

    const book = await Book.create(req.body);
    return res.status(201).json({ book });
  } catch (err) {
    return next(err);
  }
});

/** PUT /[isbn]   bookData => {book: updatedBook}  
 * Only updates requested properties, so user does not have to submit
 * all book properties
*/

router.put("/:isbn", async function (req, res, next) {
  try { 
    const bookData = await Book.findOne(req.params.isbn);
    for (let [k,v] of Object.entries(req.body)) {
      bookData[k] = v;
    }
    const result = jsonschema.validate(bookData, bookSchema);

    if (!result.valid) {
      let listOfErrors = result.errors.map(error => error.stack);
      let error = new ExpressError(listOfErrors, 400);
      return next(error);
    }

    const book = await Book.update(req.params.isbn, bookData);
    return res.json({ book });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /[isbn]   => {message: "Book deleted"} */

router.delete("/:isbn", async function (req, res, next) {
  try {
    await Book.remove(req.params.isbn);
    return res.json({ message: "Book deleted" });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
