const express = require("express");
// mongo exports

const { connectToDb, getDb } = require("./db.js");
const { ObjectId, ConnectionCheckOutFailedEvent } = require("mongodb");

// app init and middleware
const app = express();
app.use(express.json());
// db connection
let db;
connectToDb((error = null) => {
  if (!error) {
    app.listen(3000, () => {
      console.log("app listening on port 3000");
    });
    db = getDb();
  }
});

//! lesson fifteen
app.get("/books", (req, res) => {
  let books = [];
  //! lesson twenty one

  const page = req.query.p || 0;
  const booksPerPage = 3;
  db.collection("books")
    .find()
    .sort({ author: 1 })
    // skip if page is 3 will skip the first 9 pages
    // limit will just show the firs n documents after the
    .skip(page * booksPerPage)
    .limit(booksPerPage)
    .forEach((book) => {
      books.push(book);
    })
    .then(() => {
      res.json(books);
    })
    .catch((err) => {
      res.status(500).json({ error: "couldn't fetch the documents" });
    });

  // find return a cursor to make it an array use toArray or forEach
});
//! lesson sixteen

app.get("/books/:id", (req, res) => {
  let id = req.params.id;

  if (ObjectId.isValid(id)) {
    db.collection("books")
      // ned to require ObjectId form mongodb
      .findOne({ _id: new ObjectId(id) })
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        res.status(500).json({ error: "couldn't fetch the document" });
      });
  } else {
    res.status(404).json({ error: "please inter a valid id" });
  }

  // find return a cursor to make it an array use toArray or forEach
});
//! lesson eighteen

app.post("/books", (req, res) => {
  const book = req.body;

  db.collection("books")
    .insertOne(book)
    .then((result) => res.status(201).json(result))
    .catch((err) =>
      res.status(400).json({ error: "couldn't create new document" })
    );
});

//! lesson nineteen

app.delete("/books/:id", (req, res) => {
  let id = req.params.id;

  if (ObjectId.isValid(id)) {
    db.collection("books")
      .deleteOne({ _id: new ObjectId(id) })
      .then((result) => {
        res.status(201).json(result);
      })
      .catch((err) => {
        res.status(500).json({ err: "could not delete" });
      });
  } else {
    res.status(400).json({ err: "wrong Id " });
  }
});

// ! lesson twenty

app.patch("/books/:id", (req, res) => {
  const update = req.body;
  const id = req.params.id;
  console.log(update);
  if (ObjectId.isValid(id)) {
    db.collection("books")
      .updateOne({ _id: new ObjectId(id) }, { $set: update })
      .then((result) => {
        res.status(201).json(result);
      })
      .catch((err) => {
        res.status(500).json({ err: "could not update" });
      });
  } else {
    res.status(400).json({ err: "wrong Id " });
  }
});
