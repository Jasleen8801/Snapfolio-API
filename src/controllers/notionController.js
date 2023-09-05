const AuthSchema = require("../models/auth");
const BlockSchema = require("../models/block");
const dotenv = require("dotenv");
dotenv.config();
const localStorage = require("localStorage");
const { Client } = require("@notionhq/client");

const { NOTION_API_BASE_URL } = process.env;

exports.retrieveABlockController = async (req, res) => {
  // const bot_id = localStorage.getItem("bot_id");
  const bot_id = "89bdb28a-4b5e-4a86-af84-1c5801840a56";
  // console.log(bot_id);

  const auth = await AuthSchema.findOne({ bot_id: bot_id });
  const access_token = auth.access_token;
  const template_id = auth.duplicated_template_id;
  // console.log(template_id);

  const notion = new Client({
    auth: access_token,
    notionVersion: "2021-05-13",
  });

  const response = await notion.blocks.children.list({
    block_id: template_id,
    page_size: 50,
  });
  console.log(response.results[0].paragraph);

  let block_ids = [];
  for (let i = 0; i < response.results.length; i++) {
    block_ids.push(response.results[i].id);
  }

  // const page = new BlockSchema({
  //   page_id: template_id,
  //   block_ids: block_ids,
  // });
  // await page.save();

  res.send({ message: "Successfully fetched the data" });
};

exports.updateABlockController = async (req, res) => {
  // const bot_id = localStorage.getItem("bot_id");
  const bot_id = "89bdb28a-4b5e-4a86-af84-1c5801840a56";

  const auth = await AuthSchema.findOne({ bot_id: bot_id });
  const access_token = auth.access_token;
  const template_id = auth.duplicated_template_id;

  const block = await BlockSchema.findOne({ page_id: template_id });
  // console.log(block);

  // TODO: check the block id and change its properties accordingly

  const notion = new Client({
    auth: access_token,
    notionVersion: "2021-05-13",
  });

  res.send({ message: "Successfully updated the data" });
};

// TO BE DONE

exports.appendABlockController = async (req, res) => {};

exports.retrievePagePropertiesController = async (req, res) => {};

exports.deleteABlockController = async (req, res) => {};