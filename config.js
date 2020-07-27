/** Common config for bookstore. */


if (process.env.NODE_ENV === "test") {
  DB_URI = `books-test`;
} else {
  DB_URI = `books`;
}


module.exports = { DB_URI };