const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BlockSchema = new Schema({
  page_id: {
    type: String,
    required: true,
  },
  block_ids: {
    type: Array,
    default: [],
  },
  bot_id: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Block", BlockSchema);
