const express = require("express");
const cors = require("cors");
const filmRoutes = require("./routes/filmRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// ROUTES
app.use("/films", filmRoutes);

// TEST
app.get("/", (req, res) => {
  res.send("API jalan bro 🚀");
});

app.listen(3000, () => {
  console.log("Server jalan di port 3000");
});