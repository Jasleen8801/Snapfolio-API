const AuthSchema = require("../models/auth");
const localStorage = require("localStorage");
const dotenv = require("dotenv");
dotenv.config();

const { NOTION_API_BASE_URL, OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET } =
  process.env;

exports.testAPI = async (req, res) => {
  console.log(OAUTH_CLIENT_SECRET);
  console.log(OAUTH_CLIENT_ID);
};

exports.authController = async (req, res) => {
  console.log("redirectUriController");
  const code = req.query.code;
  // console.log(code);

  const encoded = Buffer.from(
    `${OAUTH_CLIENT_ID}:${OAUTH_CLIENT_SECRET}`
  ).toString("base64");
  // console.log(encoded);

  const redirect_uri = "http://localhost:3000/auth/redirect_uri";

  try {
    const response = await fetch(`${NOTION_API_BASE_URL}/oauth/token`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Basic ${encoded}`,
      },
      body: JSON.stringify({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: redirect_uri,
      }),
    });
    const body = await response.json();
    // console.log(body.owner.user);

    // if (AuthSchema.findOne({ bot_id: body.bot_id })) {
    //   console.log("already exists");
    //   res.send({
    //     access_token: body.access_token,
    //     message: "success",
    //     bot_id: body.bot_id,
    //   });
    //   return;
    // }

    const auth = new AuthSchema({
      access_token: body.access_token,
      token_type: body.token_type,
      bot_id: body.bot_id,
      workspace_name: body.workspace_name,
      workspace_id: body.workspace_id,
      user_id: body.owner.user.id,
      duplicated_template_id: body.duplicated_template_id,
    });
    await auth.save();

    localStorage.setItem("bot_id", body.bot_id);

    res.send({
      access_token: body.access_token,
      message: "success",
      bot_id: body.bot_id,
    });
  } catch (error) {
    console.log({ error: error.message });
  }
};
