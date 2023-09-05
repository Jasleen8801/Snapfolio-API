const AuthSchema = require("../models/auth");
const dotenv = require("dotenv");
dotenv.config();
const localStorage = require("localStorage");
const axios = require("axios");
const { Client } = require("@notionhq/client");

const { NOTION_API_BASE_URL } = process.env;

exports.retrieveAPageController = async (req, res) => {
  // const bot_id = localStorage.getItem("bot_id");
  const bot_id = "89bdb28a-4b5e-4a86-af84-1c5801840a56";
  console.log(bot_id);

  const auth = await AuthSchema.findOne({ bot_id: bot_id });
  const access_token = auth.access_token;
  const template_id = auth.duplicated_template_id;

  const notion = new Client({
    auth: access_token,
  });

  const response = await notion.pages.retrieve({
    page_id: template_id,
  });
  console.log(response);

  res.send({ message: "success" });
};
