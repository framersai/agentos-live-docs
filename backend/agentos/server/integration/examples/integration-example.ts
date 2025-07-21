
// agentos/examples/integration-example.ts
import express from 'express';
import { AgentOSClient } from '../server/integration/SDKClient';

const app = express();
const agentOS = new AgentOSClient({
  baseURL: 'http://localhost:3000',
  apiKey: 'your-api-key'
});

app.post('/chat', async (req, res) => {
  const response = await agentOS.sendMessage({
    textInput: req.body.message,
    selectedPersonaId: req.body.personaId
  });
  
  res.json({ 
    response: response.finalResponse.finalResponseText 
  });
});

app.listen(4000);