const fetch = require('node-fetch');

const apiUrl = process.env.API_URL;
const apiKey = process.env.API_KEY;

module.exports = async (req, res) => {
  const { conversation } = req.body;

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey}`,
  };

  const payload = {
    messages: conversation,
    model: 'gpt-3.5-turbo',
    max_tokens: 300,
    temperature: 0,
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch');
    }

    const data = await response.json();
    const botMessage = data.choices[0].message;

    res.status(200).json({ message: botMessage });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to get bot response' });
  }
};