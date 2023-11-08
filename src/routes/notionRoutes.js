const express = require("express");
const router = express.Router();

const {
  retrieveABlockController,
  updateABlockController,
  appendCodeController,
  retrievePagePropertiesController,
  appendTextBlockController,
} = require("../controllers/notionController");

router.get("/retrieve", retrieveABlockController);
router.patch("/update", updateABlockController);
router.post("/appendText", appendTextBlockController); // Main usage
router.post("/appendCode", appendCodeController); // Main usage
router.get("/properties", retrievePagePropertiesController);

module.exports = router;
