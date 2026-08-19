const express = require('express');
const cors = require('cors');
require('dotenv').config();
const OpenAI = require('openai');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message, propertiesContext, leadsContext } = req.body;

    const systemPrompt = `You are an AI Operating Agent for Thanjai Property, a premium real estate CRM in Tamil Nadu.
    
Here is the current inventory of properties available in the CRM:
${JSON.stringify(propertiesContext)}

Here is the list of active leads in the CRM:
${JSON.stringify(leadsContext)}

Your task is to assist the real estate agent by answering their questions, searching for properties matching client needs, and providing CRM summaries based strictly on the provided context. Keep your responses concise, professional, and friendly. Use markdown formatting to highlight property names and prices.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
    });

    res.json({ reply: completion.choices[0].message.content });

  } catch (error) {
    console.error('Error with OpenAI API:', error);
    res.status(500).json({ error: 'Failed to process request with AI.' });
  }
});

app.listen(PORT, () => {
  console.log(`Thanjai Property AI Backend running on port ${PORT}`);
});
