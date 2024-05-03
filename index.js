const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const path = require("path");

const PORT = process.env.PORT || 8000;

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("new-user-joined", (name) => {
    io.emit("user-joined", name); // Broadcast to all users
  });

  socket.on("send-message", (data) => {
    io.emit("receive-message", data);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

app.use(express.static(path.join(__dirname, 'public')));

http.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
