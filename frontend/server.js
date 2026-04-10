Server.js postgress


const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(express.json());
app.use(cors());

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "moviesDB",
  password: "your_password",
  port: 5432,
});

// POST
app.post("/movies", async (req, res) => {
  const { movieName } = req.body;
  const result = await pool.query(
    "INSERT INTO movies (movieName) VALUES ($1) RETURNING *",
    [movieName]
  );
  res.json(result.rows[0]);
});

// GET
app.get("/movies", async (req, res) => {
  const result = await pool.query("SELECT * FROM movies");
  res.json(result.rows);
});

// DELETE
app.delete("/movies/:id", async (req, res) => {
  await pool.query("DELETE FROM movies WHERE id = $1", [req.params.id]);
  res.json({ message: "Deleted" });
});

app.listen(5000, () => console.log("Server running on port 5000"));