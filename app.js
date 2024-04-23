const express = require('express');
const {VertexClient} = require('@google-cloud/vertex-ai');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = 3000;

app.post('/checkCredentials', async (req, res) => {
    const requestBody = req.body
    if (requestBody.credentialsType === "authToken") {
        const isValid =  await fetchResponseAuthToken(requestBody.projectRegion, requestBody.projectId, requestBody.authToken)
        const response = isValid === true ? {status: "valid credentials"} : {status: "invalid credentials", error: isValid.statusText}
        res.send(response)
    } else if (requestBody.checkType === "authService") {
        
    } else if (requestBody.checkType === "authGemini") {
            
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
        return true
    } else {
        return response
    }
}

async function featchResponeAuthGemini(API_Key, temperature, maxOutputTokens, context, message) {
    const genAI = new GoogleGenerativeAI(API_Key)
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});
    const context = context || "";
    const prompt = `${context} - ${message}`;
    const result = await model.generateContent({
        prompt: prompt,
        temperature: temperature || 0.3,
        maxOutputTokens: maxOutputTokens || 200
    });
    const text = response.text();
    const response = await result.response;
    if (response.statusCode === 200){
        return true
    } else{
        return false
    }

}




app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
