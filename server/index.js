const express = require('express');
const AWS = require('aws-sdk');
const app = express();
const cors = require('cors');
require("dotenv").config();

// Configurando o Bedrock
const bedrock = new AWS.Bedrock({
    region: process.env.AWS_REGION, // Região onde está sua base Bedrock
    accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Chaves de acesso AWS
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

app.use(cors());
app.use(express.json());
app.use('/', express.static(__dirname + '/frontend')); // Serves resources from client folder

app.post('/get-prompt-result', async (req, res) => {
    const { prompt, model = 'gpt' } = req.body;

    if (!prompt) {
        return res.status(400).send({ error: 'Prompt is missing in the request' });
    }

    try {
        if (model === 'image') {
            // Aqui, para o Bedrock, você pode substituir pela chamada a um modelo que gere imagens, se existir no Bedrock
            return res.status(400).send({ error: 'Image generation not supported with AWS Bedrock yet' });
        }

        // Configurar a solicitação ao Bedrock
        const params = {
            ModelId: process.env.BEDROCK_MODEL_ID, // ID do modelo Bedrock
            InputText: prompt, // O prompt recebido do frontend
        };

        // Chamada ao AWS Bedrock
        const response = await bedrock.invokeModel(params).promise();

        // Bedrock retorna o resultado, então você pode pegar o texto gerado e enviar para o frontend
        return res.send(response.OutputText);
    } catch (error) {
        const errorMsg = error.response ? error.response.data.error : `${error}`;
        console.error(errorMsg);
        return res.status(500).send(errorMsg);
    }
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listening on port ${port}`));
