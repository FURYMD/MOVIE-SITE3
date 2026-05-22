const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// DB CONNECT (change to MongoDB Atlas if hosting)
mongoose.connect("mongodb://127.0.0.1:27017/moviesDB");

// MOVIE MODEL
const Movie = mongoose.model("Movie", {
  title: String,
  image: String,
  video: String,
  category: String
});

// GET ALL MOVIES (AUTO LOAD)
app.get("/movies", async (req, res) => {
  const data = await Movie.find();
  res.json(data);
});

// SEARCH MOVIES
app.get("/search", async (req, res) => {
  const q = req.query.q || "";
  const data = await Movie.find({
    title: { $regex: q, $options: "i" }
  });
  res.json(data);
});

// ADD MOVIE (ADMIN API)
app.post("/add", async (req, res) => {
  const movie = new Movie(req.body);
  await movie.save();
  res.json({ message: "Movie added" });
});

// START SERVER
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
