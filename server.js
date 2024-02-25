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
  console.log("POST Received")
    try {
      const question = req.body.question;
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are playing a game in which you try to fit in with user's prompts. There may be anywhere between 1 to 8 user responses. The first prompt is the question asked to all players, the subsequent prompts are the players' responses. Analyze the answers from each player and create a single answer to the prompt that is similar to the other answers in terms of punctuation, length, tone, and word choice, with a strong emphasis on imitating sentence structure. For example, the response does not need to be grammatically correct, and you may create spelling mistakes if the user did.",
          },
          {
            role: "user",
            content: "What is your favorite memory as a child?"
          },
          {
            role: "user",
            content: question
          }
        ],
        max_tokens: 150,
      });
  
      console.log(response.choices[0].message)
      voice.textToSpeech(
        {
          fileName: "audio.mp3",
          textInput: response.choices[0].message.content
        }).then((res) => {
          console.log(res)
        })
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
      res.status(500).json({ message: "Failed to fetch response" });
    }
  });



app.listen(PORT, () => console.log(`Server running on https://localhost:${PORT}`))