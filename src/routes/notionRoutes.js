const express = require("express");
const router = express.Router();

const {
  retrieveABlockController,
  updateABlockController,
  appendABlockController,
  retrievePagePropertiesController,
} = require("../controllers/notionController");

router.get("/retrieve", retrieveABlockController);
router.patch("/update", updateABlockController);
router.patch("/append", appendABlockController);
router.get("/properties", retrievePagePropertiesController);

module.exports = router;
