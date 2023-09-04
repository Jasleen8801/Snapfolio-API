const AuthSchema = require("../models/auth");
const dotenv = require("dotenv");
dotenv.config();

const { NOTION_API_BASE_URL } = process.env;

exports.retrieveAPageController = async (req, res) => {
  const bot_id = localStorage.getItem("bot_id");

  const notion = new Notion({
    auth: {
      bot_id: bot_id,
    },
  });

  const page = notion.pages.create({
    title: "New Page",
  });

  await page.save();

  res.send("Page created");
};