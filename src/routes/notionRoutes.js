const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const router = express.Router();

const {
  retrieveABlockController,
  updateABlockController,
  appendABlockController,
  retrievePagePropertiesController,
  deleteABlockController,
} = require("../controllers/notionController");

router.get("/retrieve", retrieveABlockController);
router.patch("/update", updateABlockController);
router.patch("/append", appendABlockController);
router.get("/properties", retrievePagePropertiesController);
router.delete("/delete", deleteABlockController);

module.exports = router;
