const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const userMessage = input.value.trim();
  if (!userMessage) return;

  addMessage('You', userMessage, 'user');
  input.value = '';
  addTyping();

  try {
    const response = await fetch('https://thryve-chatbot-app-43yk.vercel.app/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage })
    });

    const data = await response.json();
    removeTyping();
    addMessage('Thryve', data.message, 'bot');
  } catch (error) {
    removeTyping();
    addMessage('Thryve', 'Sorry, something went wrong.', 'bot');
  }
});

function addMessage(sender, text, type) {
  const messageEl = document.createElement('div');
  messageEl.className = `chat-message ${type}`;
  messageEl.innerHTML = `<strong>${sender}:</strong> ${text}`;
  chatBox.appendChild(messageEl);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function addTyping() {
  const typing = document.createElement('div');
  typing.id = 'typing';
  typing.className = 'chat-message bot';
  typing.textContent = 'Thryve is typing...';
  chatBox.appendChild(typing);
}

function removeTyping() {
  const typing = document.getElementById('typing');
  if (typing) typing.remove();
}