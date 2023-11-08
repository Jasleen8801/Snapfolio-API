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

exports.updateABlockController = async (req, res) => {
  try {
    const notion = await getNotionClient();
    const auth = await AuthSchema.findOne({
      bot_id: "89bdb28a-4b5e-4a86-af84-1c5801840a56",
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

exports.appendABlockController = async (req, res) => {
  try {
    const notion = await getNotionClient();
    const auth = await AuthSchema.findOne({
      bot_id: "89bdb28a-4b5e-4a86-af84-1c5801840a56",
    });
    const template_id = auth.duplicated_template_id;

    const block = await BlockSchema.findOne({ page_id: template_id });
    const block_ids = block.block_ids;
    const block_id = block_ids[block_ids.length - 1];

    const code_endpoint = `http://localhost:${PORT}/snippet/code`;
    const output_endpoint = `http://localhost:${PORT}/snippet/output`;

    const temp1 = await axios.post(code_endpoint, {
      code: '#include <iostream>\nusing namespace std;\nint main() {\n\tcout << "Hello World!";\n\treturn 0;\n}',
      theme: "material",
      fontSize: 12,
      backgroundColor: "#282a36",
    });
    // console.log(temp1.data);
    const code_url = temp1.data.image_url;

    const temp2 = await axios.post(output_endpoint, {
      code: "[nodemon] restarting due to changes...\n[nodemon] starting `node src/app.js`\nApp listening at 3000\n Connected to DB !!",
      theme: "material",
      fontSize: 12,
      backgroundColor: "#282a36",
    });
    const output_url = temp2.data.image_url;

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
        {
          paragraph: {
            rich_text: [
              {
                text: {
                  content: "Sample Output:",
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
