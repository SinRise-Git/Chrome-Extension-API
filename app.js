const express = require('express');
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

async function fetchResponseAuthToken(region, projectId, authToken, temperature, maxOutputTokens, context) {
    const url = `https://${region}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${region}/publishers/google/models/chat-bison:predict`;
    const requestData = {
        instances: [{
            messages: [{
                author: "user",
                content: "test message to validate credentials!"
            }],
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
    console.log(requestData)
    const response = await fetch(url, requestOption)
    if (response.status === 200) {
        return true
    } else {
        return response
    }
}




app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
