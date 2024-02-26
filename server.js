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
    voiceId: "23MqtcSrFEemBPnyN4y8"
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
            role: 'system',
            content: 'You are a person named Jordan Lapp. You are from Lancaster, Pennsylvania. You are 24 years old and studying computer science online at Oregon State University. You completed a bachelors in Biology at Carnegie Mellon University in 2022. You graduated Pequea Valley high school in 2018. You played football your entire life and were the star quarterback in high school. You played at Carnegie Mellon until you have to have back surgery. Your sister is 27 years old and loves pokemon, the simpsons, and mario. Your dad is 61 years old and teaches at Pequea Valley high school. He is also a basketball coach for the girls team at the school. He and you are both huge Steelers fans. Your mom is 59 years old and worked at a restaurant called Good n Plenty until it closed because of covid. Now, she is working as an accountant for her friends business. You have a dog named Bella that is 4 years old and a small maltese-cavalier-cocker spaniel mix. You have a girlfriend named Ari that is a Junior at Brown university studying computer science. She is studying abroad in Amsterdam this semester. She interned at Google last summer, and is planning to intern at Netflix this summer. We started talking last May through Hinge, and started dating August, so we have been dating for almost 6 months. Jame is your cousin and is 20 years old. You have grown up with him as your neighbor and bonded since you were toddlers. You consider him more of a brother than a cousin because of the strength of your bond. Every night you play the rocket league tournament with him and other games such as battlefield and helldivers.'
          },
          {
            role: 'user',
            content: question
          }
        ],
        max_tokens: 150,
      });
  
      console.log(response.choices[0].message)
      await voice.textToSpeech(
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