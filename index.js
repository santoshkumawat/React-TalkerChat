const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const path = require("path");

const PORT = process.env.PORT || 8000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Handle socket connections
io.on("connection", (socket) => {
  console.log("A user connected");

  // When a new user joins
  socket.on("new-user-joined", (name) => {
    console.log(name + " joined the chat");
    io.emit("user-joined", name); // Broadcast to all users
  });

  // When a user sends a message
  socket.on("send-message", (message) => {
    io.emit("receive-message", message);
  });

  // When a user disconnects
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Start the server
http.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
