process.env.NODE_ENV = 'test';

const Book = require("../models/book");
const db = require("../db");
const app = require("../app");
const request = require("supertest");

describe("Test books routes", function() {
  
    beforeEach(async function() {
    await db.query("DELETE FROM books;");
    let data = {
                isbn: "0691161518",
                amazon_url:"http://a.co/eobPtX2",
                author: "Matthew Lane",
                language: "english",
                pages: 264,
                publisher: "Princeton University Press",
                title: "Power-Up: Unlocking the Hidden Mathematics in Video Games",
                year: 2017
    }
    let book = await Book.create(data);
    })

    describe("GET /books/", function() {
    test("Get list of all books", async function() {
        let response = await request(app)
        .get("/books/");
        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual({
                    books: [{
                        isbn: "0691161518",
                        amazon_url:"http://a.co/eobPtX2",
                        author: "Matthew Lane",
                        language: "english",
                        pages: 264,
                        publisher: "Princeton University Press",
                        title: "Power-Up: Unlocking the Hidden Mathematics in Video Games",
                        year: 2017
                    }]
        })  
    })
    })    

    describe("GET /books/:isbn", function() {
    test("Get single book", async function() {
        let response = await request(app)
        .get("/books/0691161518");
        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual({
                book: {
                    isbn: "0691161518",
                    amazon_url:"http://a.co/eobPtX2",
                    author: "Matthew Lane",
                    language: "english",
                    pages: 264,
                    publisher: "Princeton University Press",
                    title: "Power-Up: Unlocking the Hidden Mathematics in Video Games",
                    year: 2017
                }
        })  
    })
    })

    describe("POST /books/", function() {
      test("Post new book", async function() {
        let response = await request(app)
          .post("/books")
          .send({
            isbn: "0691161519",
            amazon_url:"http://a.co/eobPtX3",
            author: "Matthew Blaine",
            language: "english",
            pages: 265,
            publisher: "Harvard University Press",
            title: "Power-Up: Unlocking the Hidden Science in Video Games",
            year: 2018
          })

        expect(response.statusCode).toEqual(201);
        expect(response.body).toEqual({
                    book: {
                        isbn: "0691161519",
                        amazon_url:"http://a.co/eobPtX3",
                        author: "Matthew Blaine",
                        language: "english",
                        pages: 265,
                        publisher: "Harvard University Press",
                        title: "Power-Up: Unlocking the Hidden Science in Video Games",
                        year: 2018
                    }
        })  
      })
    })

    describe("POST /books/ failure", function() {
      test("Post new invalid format (amazon url)", async function() {
        let response = await request(app)
          .post("/books")
          .send({
            isbn: "0691161519",
            amazon_url: "a.co/eobPtX3",
            author: "Matthew Blaine",
            language: "english",
            pages: 265,
            publisher: "Harvard University Press",
            title: "Power-Up: Unlocking the Hidden Science in Video Games",
            year: 2018
          })
        expect(response.statusCode).toEqual(400);  
      })
      
      test("Post new empty input", async function() {
        let response = await request(app)
          .post("/books")
          .send({
            isbn: "0691161519",
            amazon_url: 12345,
            author: "Matthew Blaine",
            language: "",
            pages: 265,
            publisher: "Harvard University Press",
            title: "Power-Up: Unlocking the Hidden Science in Video Games",
            year: 2018
          })
        expect(response.statusCode).toEqual(400);  
      })
    })
  
    describe("PUT /books/:isbn", function() {
      test("Put update book data", async function() {
        let response = await request(app)
          .put("/books/0691161518")
          .send({
                 pages: 285,
                 year: 2020 
          })
        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual({
                          book: {
                            isbn: "0691161518",
                            amazon_url:"http://a.co/eobPtX2",
                            author: "Matthew Lane",
                            language: "english",
                            pages: 285,
                            publisher: "Princeton University Press",
                            title: "Power-Up: Unlocking the Hidden Mathematics in Video Games",
                            year: 2020
                          }
        })  
      })
    })
})

afterAll(async function () {
    await db.end();
  });
