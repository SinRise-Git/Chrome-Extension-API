const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = 3000;

app.post('/checkCredentials', async (req, res) => {
    const requestBody = req.body
    if (requestBody.credentialsType === "authToken") {
        const isValid =  await fetchResponseAuthToken(requestBody.projectRegion, requestBody.projectId, requestBody.authToken)
        const response = isValid.status === true ? {status: "valid credentials"} : {status: "invalid credentials", error: isValid.error.statusText}
        res.send(response)
    } else if (requestBody.credentialsType === "authGemini") {
        const isValid = await featchResponeAuthGemini(requestBody.studioKey)
        console.log(isValid)
        const response = isValid.status === true ? {status: "valid credentials"} : {status: "invalid credentials", error: isValid.error}
        res.send(response)
    }
})

async function fetchResponseAuthToken(region, projectId, authToken, temperature, maxOutputTokens, context, message) {
    const url = `https://${region}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${region}/publishers/google/models/chat-bison:predict`;
    const requestData = {
        instances: [{
            messages: [{
                author: "user",
                content: message || "test message to validate credentials!"
            }],
            context: context || ""
        }],
        parameters: {
            temperature: temperature || 0.3,
            maxOutputTokens: maxOutputTokens || 200,
            topP: 0.8,
            topK: 40,
        },
    };
    const headers = {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
    };
    const requestOption = {
        method: "post",
        url: url,
        headers: headers,
        data: requestData,
    }
    const response = await fetch(url, requestOption)
    if (response.status === 200) {
        return {status: true, text: "valid"}
    } else {
        return {status: false, error: response.statusText}
    }
}

async function featchResponeAuthGemini(API_Key, temperature, maxOutputTokens, context, message) {
    try {
        const genAI = new GoogleGenerativeAI(API_Key);
        const generationConfig = {
            maxOutputTokens: maxOutputTokens || 200,
            temperature: temperature || 0.9,
        };
        const model = genAI.getGenerativeModel({ model: "gemini-pro", generationConfig});
        const prompt = `${context || ""} - ${message}`;
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text(); 
        return {status: true, text: text}
    } catch (error) {
        return {status: false, error: "Invalid API Key"};
    }
}

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
