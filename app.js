const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = 3000;

app.post('/checkCredentials', async (req, res) => {
    const requestBody = req.body
    if (requestBody.credentialsType === "authToken") {
        const url = `https://${requestBody.projectRegion}-aiplatform.googleapis.com/v1/projects/${requestBody.projectId}/locations/${requestBody.projectRegion}/publishers/google/models/chat-bison:predict`;
        const requestData = {
			instances: [{
				messages: [{
					author: "user",
					content: "test message to validate credentials!"
				}],
			}],
			parameters: {
				temperature: 0.3,
				maxOutputTokens: 200,
				topP: 0.8,
				topK: 40,
			},
		};
        const headers = {
			Authorization: `Bearer ${requestBody.authToken}`,
			'Content-Type': 'application/json',
		};
        const requestOption = {
            method: "post",
            url: url,
            headers: headers,
            data: requestData,
        }
        const response = await fetch(url, requestOption)
        console.log(response.status)
        console.log(response.statusText)
        if (response.status === 200) {
            res.send({status: "valid credentials"})
        } else {
            res.send({status: "invalid credentials"})
        }
    } else if (requestBody.checkType === "authService") {
        
    } else if (requestBody.checkType === "authGemini") {
            
    }
})

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
