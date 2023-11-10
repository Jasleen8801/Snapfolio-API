const AuthSchema = require("../models/auth");
const BlockSchema = require("../models/block");
const ChildSchema = require("../models/child");
const { Client } = require("@notionhq/client");
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

const { PORT } = process.env;

const getNotionClient = async (bot_id) => {
  const auth = await AuthSchema.findOne({ bot_id });
  if (!auth) {
    throw new Error("Authentication not found");
  }

  return new Client({
    auth: auth.access_token,
    notionVersion: "2022-06-28",
  });
};

exports.appendTextBlockController = async (req, res) => {
  try {
    const bot_id = req.body.bot_id;
    // console.log(bot_id);
    const page_id = req.body.page_id;
    const notion = await getNotionClient(bot_id);

    const block = await BlockSchema.findOne({ page_id: page_id });
    // console.log(block);
    let block_id = page_id;

    const text = req.body.text;
    const boldText = req.body.boldText;
    const response = await notion.blocks.children.append({
      block_id: block_id,
      children: [
        {
          paragraph: {
            rich_text: [
              {
                type: "text",
                text: {
                  content: boldText,
                },
                annotations: {
                  bold: true,
                  color: "default",
                },
              },
            ],
          },
        },
        {
          paragraph: {
            rich_text: [
              {
                type: "text",
                text: {
                  content: text,
                },
                annotations: {
                  bold: false,
                  color: "default",
                },
              },
            ],
          },
        }
      ],
    });
    const id = response.results[0].id;
    block.block_ids.push(id);
    await block.save();
    console.log(response);
    res.send({ message: "Successfully appended the data" });
  } catch (error) {
    console.log(error);
  }
}

exports.appendCodeController = async (req, res) => {
  try {
    const bot_id = req.body.bot_id;
    const notion = await getNotionClient(bot_id);
    const flag = req.body.flag; // if flag=true, then add output too, else add only code
    let code = req.body.code;
    // console.log(code);
    const subheading = req.body.subheading || 'Problem';
    const description = req.body.description || 'Description';
    const output = req.body.output || null;
    const theme = req.body.theme || "material";
    const fontSize = req.body.fontSize || 12;
    const backgroundColor = req.body.backgroundColor || "#282a36";
    const page_id = req.body.page_id;
    // console.log(page_id);

    const code_endpoint = `http://localhost:${PORT}/snippet/code`;
    const codeRes = await axios.post(code_endpoint, {
      code: code,
      theme: theme,
      fontSize: fontSize,
      backgroundColor: backgroundColor,
    });
    const code_url = codeRes.data.image_url;

    if (flag) {
      const output_endpoint = `http://localhost:${PORT}/snippet/output`;
      const outputRes = await axios.post(output_endpoint, {
        code: output,
        theme: theme,
        fontSize: fontSize,
        backgroundColor: backgroundColor,
      });
      const output_url = outputRes.data.image_url;
      const response = await notion.blocks.children.append({
        block_id: page_id,
        children: [
          {
            heading_2: {
              rich_text: [
                {
                  text: {
                    content: subheading,
                  },
                },
              ],
            },
          },
          {
            paragraph: {
              rich_text: [
                {
                  text: {
                    content: description,
                  },
                },
              ],
            },
          },
          {
            object: "block",
            type: "image",
            image: {
              type: "external",
              external: {
                url: code_url,
              },
            },
          },
          {
            paragraph: {
              rich_text: [
                {
                  text: {
                    content: "Output is:",
                  },
                },
              ],
            },
          },
          {
            object: "block",
            type: "image",
            image: {
              type: "external",
              external: {
                url: output_url,
              },
            },
          },
        ],
      });
      const id = response.results[0].id;
      block.block_ids.push(id);
      await block.save();
      res.send({ message: "Successfully appended the data" });
      return;
    }

    const response = await notion.blocks.children.append({
      block_id: page_id,
      children: [
        {
          heading_2: {
            rich_text: [
              {
                text: {
                  content: subheading,
                },
              },
            ],
          },
        },
        {
          paragraph: {
            rich_text: [
              {
                text: {
                  content: description,
                },
              },
            ],
          },
        },
        {
          object: "block",
          type: "image",
          image: {
            type: "external",
            external: {
              url: code_url,
            },
          },
        },
      ],
    });
    // console.log(response);
    const id = response.results[0].id;
    block.block_ids.push(id);
    await block.save();
    res.send({ message: "Successfully appended the data" });
  } catch (error) {
    console.error("Error in appendABlockController:", error.message);
    res.status(500).json({ error: "An error occurred." });
  }
};

exports.createPageController = async (req, res) => {
  try {
    const bot_id = req.body.bot_id;
    const notion = await getNotionClient(bot_id);
    const title = req.body.title;
    const auth = await AuthSchema.findOne({
      bot_id: bot_id,
    });
    // console.log(auth);
    const parent_page_id = auth.duplicated_template_id;
    const response = await notion.pages.create({
      "parent": {
        "type": "page_id",
        "page_id": parent_page_id
      },
      "properties": {
        "title": {
          "title": [
            {
              "text": {
                "content": title
              }
            }
          ]
        }
      }
    });
    console.log(response);
    const page_id = response.id;
    const child = await ChildSchema.findOne({ page_id: parent_page_id });
    child.child_ids.push(page_id);
    await child.save();

    const block = new BlockSchema({
      page_id: page_id,
      block_ids: [],
      bot_id: bot_id,
    });
    await block.save();

    res.send({ message: "Successfully created the page", page_id: page_id });
  } catch (error) {
    console.log(error);
  }
}

exports.getPagesController = async (req, res) => {
  const bot_id = req.query.bot_id;
  // console.log(bot_id);
  const notion = await getNotionClient(bot_id);
  // const bot_id = "89bdb28a-4b5e-4a86-af84-1c5801840a56";
  const child = await ChildSchema.find({ bot_id: bot_id });
  // console.log(child);
  const parent_page_id = child[0].page_id;
  const child_ids = child[0].child_ids;
  const pages = [];
  pages.push({ title: "Home", id: parent_page_id });
  if(child_ids.length === 0) {
    res.send({ message: "No child pages found", pages: pages });
    return;
  }
  let count = 1;
  for (let i = 0; i < child_ids.length; i++) {
    const page = await notion.pages.retrieve({ page_id: child_ids[i] });
    const title1 = page.properties.title.title[0].text.content;
    const title = `${count++}. ${title1}`;
    const id = page.id;
    const temp = { title, id };
    pages.push(temp);
  }
  console.log(pages);
  res.send({ message: "Successfully fetched the pages", pages: pages }); 
}

// TODO: In future, we can use these if needed
exports.retrievePagePropertiesController = async (req, res) => {
  // TODO: Maybe needed in future
  try {
    const bot_id = req.body.bot_id;
    const notion = await getNotionClient(bot_id);
    const auth = await AuthSchema.findOne({
      bot_id: bot_id,
    });
    const template_id = auth.duplicated_template_id; // Fetch template_id as needed

    const response = await notion.pages.retrieve({
      page_id: template_id,
    });

    const title = response.properties.title.title;
    console.log(title);
    res.send({ message: "Successfully fetched the data", title: title });
  } catch (error) {
    console.error("Error in retrievePagePropertiesController:", error.message);
    res.status(500).json({ error: "An error occurred." });
  }
};

exports.retrieveABlockController = async (req, res) => {
  // TODO: NO LONGER NEEDED!!!
  try {
    const bot_id = req.body.bot_id;
    const notion = await getNotionClient(bot_id);
    const auth = await AuthSchema.findOne({
      bot_id: bot_id,
    });
    const template_id = auth.duplicated_template_id; // Fetch template_id as needed

    if (await BlockSchema.findOne({ page_id: template_id })) {
      // console.log("Already exists");
      res.send({ message: "Already exists" });
      return;
    }

    const response = await notion.blocks.children.list({
      block_id: template_id,
      page_size: 50,
    });

    const block_ids = response.results.map((result) => result.id);

    const page = new BlockSchema({
      page_id: template_id,
      block_ids: block_ids,
      bot_id: bot_id,
    });
    await page.save();

    res.send({ message: "Successfully fetched the data" });
  } catch (error) {
    console.error("Error in retrieveABlockController:", error.message);
    res.status(500).json({ error: "An error occurred." });
  }
};

exports.updateABlockController = async (req, res) => {
  // TODO: NO LONGER NEEDED!!!
  try {
    const botId = req.body.bot_id;
    const notion = await getNotionClient(botId);
    const auth = await AuthSchema.findOne({
      bot_id: botId,
    });
    const template_id = auth.duplicated_template_id; // Fetch template_id as needed

    const block = await BlockSchema.findOne({ page_id: template_id });
    const block_ids = block.block_ids;

    const block_id = block_ids[0];
    const content = "You're hacked! :D ";
    const content1 =
      "FUCKKKKK OFFFFFFFFFFFFFFFFFFFFFFFFFFFFF";

    const response = await notion.blocks.update({
      block_id: block_id,
      paragraph: {
        rich_text: [
          {
            type: "text",
            text: {
              content: content,
            },
            annotations: {
              bold: true,
              color: "red",
            },
          },
          {
            type: "text",
            text: {
              content: content1,
            },
            annotations: {
              italic: true,
              color: "red",
            },
          },
        ],
      },
    });
    console.log(response);

    res.send({ message: "Successfully updated the data" });
  } catch (error) {
    console.error("Error in updateABlockController:", error.message);
    res.status(500).json({ error: "An error occurred." });
  }
};