const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const router = express.Router();

const { testAPI, authController } = require("../controllers/authController");
const { AUTHORIZATION_URL } = process.env;

router.get("/test", testAPI);
router.post("/redirect_uri", authController);
router.get("/", (req, res) => {
  // console.log(AUTHORIZATION_URL);
  res.render("login", {
    title: "Login Page",
    authorization_url: AUTHORIZATION_URL,
  });
});
router.get("/redirect_uri", (req, res) => {
  res.render("redirect_uri", {
    title: "Redirect URI Page",
  });
});

module.exports = router;
