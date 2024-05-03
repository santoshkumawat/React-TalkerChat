const socket = io();

socket.on("user-joined", (name) => {
  console.log(`${name} joined the chat`);
});

socket.on("receive-message", (data) => {
  console.log(`${data.name}: ${data.message}`);
  appendMessage(`${data.name}: ${data.message}`);
});

document.getElementById("send-container").addEventListener("submit", (e) => {
  e.preventDefault();
  const messageInput = document.getElementById("messageInp");
  const message = messageInput.value.trim();
  if (message) {
    socket.emit("send-message", { message });
    messageInput.value = "";
  }
});

function appendMessage(message) {
  const messageBox = document.querySelector(".message-box");
  const messageElement = document.createElement("div");
  messageElement.innerText = message;
  messageBox.appendChild(messageElement);
}
