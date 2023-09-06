const express = require("express");
const router = express.Router();
const { beautifyController } = require("../controllers/snippetController");

router.post("/beautify", beautifyController);

module.exports = router;