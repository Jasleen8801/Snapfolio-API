# SnapFolio API
This API allows you to create, read, update notes in Notion, and is exclusively used by SnapFolio.

SnapFolio is a VS Code extension that allows you to write the documentation of your project or college assignment on your Notion Page directly from VS Code. 

## Setup

1. Clone the repo

    ```bash
    git clone https://github.com/Jasleen8801/Notion-api-practice.git
    cd Notion-api-practice
    ```

2. Setting Envrionment Variables

    Create a `.env` file in the root directory of the project and add the following variables:

    ```bash
    NOTION_SECRET=<your-notion-secret>
    NOTION_PAGE_ID=<your-notion-page-id>
    NOTION_API_BASE_URL="https://api.notion.com/v1"
    OAUTH_CLIENT_ID=<your-oauth-client-id>
    OAUTH_CLIENT_SECRET=<your-oauth-client-secret>
    AUTHORIZATION_URL=<your-authorization-url>
    MONGODB_URI=<your-mongodb-uri>
    PORT=3000
    GCLOUD_PROJECT_ID=<your-gcloud-project-id>
    BUCKET_NAME=<your-bucket-name>
    CARBON_URL="https://carbon.now.sh/"
    CARBON_IMG_SELECTOR="#export-container  .container-bg"
    ```

3. Install dependencies

    ```bash
    npm install
    ```

4. Setup Google Cloud Storage

    - Create a Google Cloud Storage bucket
    - Create a service account and download the JSON file
    - Rename the JSON file to `gcloud_credentials.json` and place it in the root directory of the project

5. Setup MongoDB

    - Create a MongoDB Atlas cluster
    - Create a database and a collection
    - Create a user and add it to the database
    - Add the connection string to the `.env` file

6. Setup Notion

    - Create a Notion integration and keep it public
    - Setup the template page and it to the integration
    - Setup the authorization URL and other variables in the `.env` file

## Run the API

To run the API, run the following command:
```bash
npm start
```

## API Endpoints

1. `GET /auth`

    This endpoint is used to get to the home page of the API.

2. `GET /auth/redirect_uri`

    This endpoint is used to get the authorization code from Notion. It redirects to the Notion authorization page.

3. `GET /notion/retrieve`

    This endpoint is used to retrieve the blocks from the Notion page.

4. `PATCH /notion/update`

    This endpoint is used to update the blocks in the Notion page.

5. `PATCH /notion/append`

    This endpoint is used to append a new block to the Notion page.

6. `GET /notion/properties`

    This endpoint is used to get the properties of the Notion page, including the uri, title and other important information.

7. `POST /snippet/beautify`

    This endpoint is used to beautify the code snippet, create its image and store it in google cloud bucket.


## FOR DEVELOPERS
Agar madad karni hai, toh todo mein jaake dekh lo.