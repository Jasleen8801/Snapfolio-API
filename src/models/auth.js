const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AuthSchema = new Schema({
  access_token: {
    type: String,
    required: true,
  },
  token_type: {
    type: String,
  },
  bot_id: {
    type: String,
  },
  workspace_name: {
    type: String,
  },
  workspace_id: {
    type: String,
  },
  user_id: {
    type: String,
  },
  duplicated_template_id: {
    type: String,
  },
});

module.exports = mongoose.model("Auth", AuthSchema);
