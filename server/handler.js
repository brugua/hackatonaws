const serverless = require('serverless-http');
const express = require('express');
const AWS = require('aws-sdk');
const cors = require('cors');
require("dotenv").config();

// Configurando o Bedrock
const bedrock = new AWS.Bedrock({
    //region: process.env.MY_AWS_REGION,
    //accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID,
    //secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY
});

const app = express();
app.use(cors());
app.use(express.json());

app.post('/get-prompt-result', async (req, res) => {
    const { prompt, model = 'gpt' } = req.body;

    if (!prompt) {
        return res.status(400).send({ error: 'Prompt is missing in the request' });
    }

    try {
        if (model === 'image') {
            return res.status(400).send({ error: 'Image generation not supported with AWS Bedrock yet' });
        }

        const params = {
            ModelId: process.env.MY_BEDROCK_MODEL_ID,
            InputText: prompt,
        };

        const response = await bedrock.invokeModel(params).promise();
        return res.send(response.OutputText);
    } catch (error) {
        const errorMsg = error.response ? error.response.data.error : `${error}`;
        console.error(errorMsg);
        return res.status(500).send(errorMsg);
    }
});

module.exports.handler = serverless(app);
