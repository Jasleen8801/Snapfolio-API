const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChildSchema = new Schema({
  page_id: {
    type: String,
    required: true,
  },
  child_ids: {
    type: Array,
    default: [],
  },
  bot_id: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Child', ChildSchema);