// JavaScript to handle the form submission
document.getElementById('questionForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    console.log("here")
    const question = document.getElementById('questionInput').value;
    const response = await fetch('/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    });
    console.log("Here")
    const data = await response.json();
    console.log("HERE")
    document.getElementById('answer').textContent = data.answer;
  });