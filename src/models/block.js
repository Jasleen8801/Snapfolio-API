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
});

module.exports = mongoose.model("Block", BlockSchema);
