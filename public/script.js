// JavaScript to handle the form submission
document.getElementById('questionForm').addEventListener('submit', async function(e) {
    e.preventDefault()
    console.log("HERE")
    const question = document.getElementById('questionInput').value
    fetch('/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    })
    .then(response => response.json())
    .then(data => {
      if(data.audioPath) {
        console.log("VALID AUDIO PATH")
        const audioUrl = data.audioPath
        const audio = new Audio(audioUrl)
        audio.play()
          .then(() => console.log('Audio is playing...'))
          .catch(error => console.error('Error playing audio:', error))
      } else {
        console.log('No audio path received')
      }
    })
    .catch(error => console.error('Fetch error:', error))
})