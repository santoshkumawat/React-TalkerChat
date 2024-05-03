const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const path = require("path");

const httpServer = http.createServer(app);
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "*",
  },
});

const users = {}; // Track users

io.on("connection", (socket) => {
  // When a new user joins
  socket.on("new-user-joined", (name) => {
    users[socket.id] = name;
    io.emit("user-joined", name); // Broadcast to all users
  });

  // When a user sends a message
  socket.on("send-message", (message) => {
    io.emit("receive-message", { 
      message: message, 
      name: users[socket.id] 
    });
  });

  // When a user disconnects
  socket.on('disconnect', () => {
    io.emit("user-left", users[socket.id]);
    delete users[socket.id];
  });
});

app.use(cors());
app.use('/', express.static(path.join(__dirname, 'public')));

httpServer.listen(process.env.PORT || 8000, () => {
  console.log('Server started at ', process.env.PORT || 8000);
});
