require('dotenv').config() // Create process.env object
const PORT = process.env.PORT; // Determine port

const express = require('express') // Create Express app
const app = express()

app.use(express.json()) // Middleware to parse JSON bodies
app.use(express.static('public'))
app.use(express.urlencoded({extended: false}))

const ElevenLabs = require('elevenlabs-node') // Create Elevenlabs instance
const voice = new ElevenLabs(
  {
    apiKey: process.env.ELEVENLABS_API_KEY,
  }
)

const OpenAI = require('openai') // Create OPENAI instance
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

// Route to handle question submission
app.post('/ask', async (req, res) => {
  console.log('POST Received')
    try {
      const question = req.body.question;
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: question
          }
        ],
        max_tokens: 150,
      });
  
      console.log(response.choices[0].message)
      voice.textToSpeech(
        {
          fileName: 'public/audio.mp3',
          textInput: response.choices[0].message.content
        }).then(() => {
          console.log('Audio file created')
        })
        res.status(201).json({ audioPath: '/audio.mp3' })
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      res.status(500).json({ message: 'Failed to fetch response' });
    }
  });



app.listen(PORT, () => console.log(`Server running on https://localhost:${PORT}`))