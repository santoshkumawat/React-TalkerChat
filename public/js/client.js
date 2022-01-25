const socket = io({
  transports: ['websocket']
});

const form = document.getElementById("send-container");

const messageInput = document.getElementById("messageInp");

const messageContainer = document.querySelector(".message-box");

const UserNameShow = document.getElementById("userName");

var audio = new Audio("../ting.mp3");

const append = (message, position) => {
  const messageElement = document.createElement("div");
  messageElement.innerText = message;
  messageElement.classList.add("message");
  messageElement.classList.add(position);

  messageContainer.append(messageElement);
  if (position == "left") {
    audio.play();
  }
};

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const message = messageInput.value;
  append(`You: ${message}`, "right");
  socket.emit("send", message);
  messageInput.value = " ";
});

const name = prompt("Enter Your Name To Join");
socket.emit("new-user-joined", name);
UserNameShow.append(name);

socket.on("user-joined", (name) => {
  append(`${name} joined the chat`, "right");
});



socket.on("receive", (data) => {
  append(`${data.name}:${data.message}`, "left");

});
