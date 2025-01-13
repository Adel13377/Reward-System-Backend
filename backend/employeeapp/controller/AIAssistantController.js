const groqClient = require('../groqClient');
const systemPrompts = require('../utils/systemPrompts');

const handleChat = async (req, res) => {
  try {
    const { input } = req.body;

    // Validate user input
    if (!input) {
      return res.status(400).json({ error: 'Input is required' });
    }


    const systemPrompt = {
      role: 'system',
      content: systemPrompts.default,
    };

    // Call the Groq API
    const response = await groqClient.chat.completions.create({
      messages: [
        // { role: 'system', content: 'You are a helpful assistant.' },
        systemPrompt,
        { role: 'user', content: input },
      ],
      model: 'llama3-8b-8192',
    });

    const assistantMessage =
      response.choices[0]?.message?.content || 'No response';

    // Return response
    res.status(200).json({ message: assistantMessage });
  } catch (error) {
    console.error('Groq API Error:', error);
    res.status(500).json({ error: 'Failed to communicate with Groq API' });
  }
};

module.exports = { handleChat };