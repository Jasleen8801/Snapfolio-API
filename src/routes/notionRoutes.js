const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const router = express.Router();

const { retrieveAPageController } = require("../controllers/notionController");

router.get("/", retrieveAPageController);

module.exports = router;