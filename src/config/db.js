const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.set("strictQuery", false);

const InitiateMongoServer = () => {
  mongoose
    .connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Connected to DB !!");
    })
    .catch((err) => {
      console.log("DB Connection Error: ", err);
    });
};

module.exports = InitiateMongoServer;