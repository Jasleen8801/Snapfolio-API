const express = require("express");
const router = express.Router();

const {
  retrieveABlockController,
  updateABlockController,
  createPageController,
  appendCodeController,
  retrievePagePropertiesController,
  appendTextBlockController,
  getPagesController
} = require("../controllers/notionController");

router.get("/getPages", getPagesController); // Main usage
router.post("/createPage", createPageController); // Main usage
router.get("/retrieve", retrieveABlockController);
router.patch("/update", updateABlockController);
router.post("/appendText", appendTextBlockController); // Main usage
router.post("/appendCode", appendCodeController); // Main usage
router.get("/properties", retrievePagePropertiesController);

module.exports = router;
