// client.js
const socket = io();

const messageForm = document.getElementById("send-container");
const messageInput = document.getElementById("messageInp");
const messageBox = document.querySelector(".message-box");

// Get username from prompt or user input
const username = prompt("Enter your username:");
if (username) {
  document.getElementById("userName").innerText += username;
  socket.emit("new-user-joined", username);
}

// Listen for new messages
socket.on("receive-message", (data) => {
  appendMessage(`${data.name}: ${data.message}`);
});

// Send message
messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value.trim();
  if (message) {
    appendMessage(`You: ${message}`);
    socket.emit("send-message", message);
    messageInput.value = "";
  }
});

// Append message to the chat box
function appendMessage(message) {
  const messageElement = document.createElement("div");
  messageElement.innerText = message;
  messageBox.append(messageElement);
}
