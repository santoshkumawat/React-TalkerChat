const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const path = require("path"); // Add this line

app.use(cors()); 
app.use('/', express.static(path.join(__dirname, 'public')));

const httpServer = http.createServer(app);

const io = require("socket.io")(httpServer, {
  cors: {
    origin: "*", 
  },
});

const users = {}; 
const userSockets = {}; // Track sockets of users

io.on("connection", (socket) => {
  socket.on("new-user-joined", (name) => {
    users[socket.id] = name;
    userSockets[name] = socket; // Associate user name with socket
    socket.broadcast.emit("user-joined", name);
  });

  socket.on("join-private-chat", (otherUserName) => {
    const roomId = [users[socket.id], otherUserName].sort().join('-');
    socket.join(roomId);
  });

  socket.on("send-private-message", (message, otherUserName) => {
    const roomId = [users[socket.id], otherUserName].sort().join('-');
    io.to(roomId).emit("receive-private-message", { 
      message: message, 
      name: users[socket.id] 
    });
  });

  socket.on('disconnect', () => {
    const disconnectedUser = users[socket.id];
    delete users[socket.id];
    delete userSockets[disconnectedUser];
  });
});

httpServer.listen(process.env.PORT || 8000, () => {
  console.log('Server started at ', process.env.PORT || 8000);
});
