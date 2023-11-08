const AuthSchema = require("../models/auth");
const BlockSchema = require("../models/block");
const { Client } = require("@notionhq/client");
const localStorage = require("localStorage");
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

const { PORT } = process.env;

const getNotionClient = async () => {
  // const bot_id = localStorage.getItem("bot_id");
  const bot_id = "89bdb28a-4b5e-4a86-af84-1c5801840a56"; 
  // const bot_id = vscode.workspace.getConfiguration("notion").get("bot_id");
  const auth = await AuthSchema.findOne({ bot_id });

  if (!auth) {
    throw new Error("Authentication not found");
  }

  return new Client({
    auth: auth.access_token,
    // notionVersion: "2021-05-13",
  });
};

exports.retrieveABlockController = async (req, res) => {
  try {
    const notion = await getNotionClient();
    const auth = await AuthSchema.findOne({
      bot_id: "89bdb28a-4b5e-4a86-af84-1c5801840a56",
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
    });
    await page.save();

    res.send({ message: "Successfully fetched the data" });
  } catch (error) {
    console.error("Error in retrieveABlockController:", error.message);
    res.status(500).json({ error: "An error occurred." });
  }
};

exports.appendTextBlockController = async (req, res) => {
  try {
    const notion = await getNotionClient();
    const bot_id = req.body.bot_id;
    // console.log(bot_id);
    const auth = await AuthSchema.findOne({
      bot_id: bot_id,
    });
    const template_id = auth.duplicated_template_id; 
    
    const block = await BlockSchema.findOne({ page_id: template_id });
    // console.log(block);
    if(!block) {
      // when the page is not created
      const response = await notion.blocks.children.list({
        block_id: template_id,
        page_size: 50,
      });
      const block_ids = response.results.map((result) => result.id);
      const page = new BlockSchema({
        page_id: template_id,
        block_ids: block_ids,
      });
      await page.save();
    }
    const block1 = await BlockSchema.findOne({ page_id: template_id });
    const block_ids = block1.block_ids;
    const block_id = block_ids[block_ids.length - 1];

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
    // console.log(response);
    res.send({ message: "Successfully appended the data" });
  } catch (error) {
    console.log(error);
  }
}

exports.updateABlockController = async (req, res) => {
  // TODO: NO LONGER NEEDED!!!
  try {
    const notion = await getNotionClient();
    const botId = req.body.bot_id;
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

exports.appendCodeController = async (req, res) => {
  try {
    const notion = await getNotionClient();
    const bot_id = req.body.bot_id;
    const flag = req.body.flag; // if flag=true, then add output too, else add only code
    const code = req.body.code;
    console.log(code);
    const subheading = req.body.subheading || 'Problem';
    const description = req.body.description || 'Description';
    const output = req.body.output || null;
    const theme = req.body.theme || "material";
    const fontSize = req.body.fontSize || 12;
    const backgroundColor = req.body.backgroundColor || "#282a36";

    const auth = await AuthSchema.findOne({
      bot_id: bot_id,
    });
    const template_id = auth.duplicated_template_id;

    const block = await BlockSchema.findOne({ page_id: template_id });
    if(!block) {
      // when the page is not created
      const response = await notion.blocks.children.list({
        block_id: template_id,
        page_size: 50,
      });
      const block_ids = response.results.map((result) => result.id);
      const page = new BlockSchema({
        page_id: template_id,
        block_ids: block_ids,
      });
      await page.save();
    }
    const block1 = await BlockSchema.findOne({ page_id: template_id });
    const block_ids = block1.block_ids;
    const block_id = block_ids[block_ids.length - 1];

    const code_endpoint = `http://localhost:${PORT}/snippet/code`;
    const codeRes = await axios.post(code_endpoint, {
      code: code,
      theme: theme,
      fontSize: fontSize,
      backgroundColor: backgroundColor,
    });
    const code_url = codeRes.data.image_url;

    if(flag){
      const output_endpoint = `http://localhost:${PORT}/snippet/output`;
      const outputRes = await axios.post(output_endpoint, {
        code: output,
        theme: theme,
        fontSize: fontSize,
        backgroundColor: backgroundColor,
      });
      const output_url = outputRes.data.image_url;  
      const response = await notion.blocks.children.append({
        block_id: block_id,
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
      res.send({ message: "Successfully appended the data" });
      return;
    }

    const response = await notion.blocks.children.append({
      block_id: block_id,
      children: [
        {
          heading_2: {
            rich_text: [
              {
                text: {
                  content: "Problem 1",
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
                  content: "Write a C++ function that prints 'Hello World'.",
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
    console.log(response);

    res.send({ message: "Successfully appended the data" });
  } catch (error) {
    console.error("Error in appendABlockController:", error.message);
    res.status(500).json({ error: "An error occurred." });
  }
};

exports.retrievePagePropertiesController = async (req, res) => {
  try {
    const notion = await getNotionClient();
    const auth = await AuthSchema.findOne({
      bot_id: "89bdb28a-4b5e-4a86-af84-1c5801840a56",
    });
    const template_id = auth.duplicated_template_id; // Fetch template_id as needed

    const response = await notion.pages.retrieve({
      page_id: template_id,
    });

    const title = response.properties.title.title;
    res.send({ message: "Successfully fetched the data" });
  } catch (error) {
    console.error("Error in retrievePagePropertiesController:", error.message);
    res.status(500).json({ error: "An error occurred." });
  }
};
