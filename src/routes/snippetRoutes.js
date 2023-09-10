const express = require("express");
const router = express.Router();
const { codeController, outputController } = require("../controllers/snippetController");

router.post("/code", codeController);
router.post("/output", outputController);

module.exports = router;