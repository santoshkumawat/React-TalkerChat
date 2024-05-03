const socket = io();

// Prompt user to enter their name when joining the chat
const username = prompt("Please enter your name:");
if (username) {
  socket.emit("new-user-joined", username);
} else {
  // Handle case when user cancels prompt or enters empty name
  // For example, you could redirect them or display an error message
}

document.getElementById("send-container").addEventListener("submit", (e) => {
  e.preventDefault();
  const messageInput = document.getElementById("messageInp");
  const message = messageInput.value.trim();
  if (message) {
    socket.emit("send-message", message);
    messageInput.value = "";
  }
});

socket.on("user-joined", (name) => {
  console.log(`${name} joined the chat`);
});

socket.on("receive-message", (data) => {
  console.log(`${data.name}: ${data.message}`);
  appendMessage(`${data.name}: ${data.message}`);
});

function appendMessage(message) {
  const messageBox = document.querySelector(".message-box");
  const messageElement = document.createElement("div");
  messageElement.innerText = message;
  messageBox.appendChild(messageElement);
}
