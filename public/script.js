// JavaScript to handle the form submission
document.getElementById('questionForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const question = document.getElementById('questionInput').value;
    const response = await fetch('/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    });
    const data = await response.json();
    document.getElementById('answer').textContent = data.answer;
  });