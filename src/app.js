const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

const authRoutes = require("./routes/authRoutes");
const notionRoutes = require("./routes/notionRoutes");
const InitiateMongoServer = require("./config/db");

InitiateMongoServer();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.set("view engine", "ejs");

app.use("/auth", authRoutes);
app.use("/notion", notionRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App listening at ${PORT}`);
});
