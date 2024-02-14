require('dotenv').config() // Create process.env object
const PORT = process.env.PORT; // Determine port

const express = require('express') // Create Express app
const app = express()

app.use(express.json()) // Middleware to parse JSON bodies
app.use(express.static('public'))

const OpenAI = require('openai')
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

// Route to handle question submission
app.post('/ask', async (req, res) => {
    try {
      const question = req.body.question;
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        prompt: question,
        max_tokens: 150,
      });
  
      res.json({ answer: response.data.choices[0].text.trim() });
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
      res.status(500).json({ message: "Failed to fetch response" });
    }
  });



app.listen(PORT, () => console.log(`Server running on https://localhost:${PORT}`))