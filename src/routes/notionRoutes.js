const express = require("express");
const router = express.Router();

const {
  retrieveABlockController,
  updateABlockController,
  appendABlockController,
  retrievePagePropertiesController,
  appendTextBlockController,
} = require("../controllers/notionController");

router.get("/retrieve", retrieveABlockController);
router.patch("/update", updateABlockController);
router.post("/appendText", appendTextBlockController); // Main usage
router.patch("/append", appendABlockController);
router.get("/properties", retrievePagePropertiesController);

module.exports = router;
