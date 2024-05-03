const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");

app.use(cors()); 
app.use('/', express.static(path.join(__dirname, 'public')));

// ... (routes like '/test' if needed) 

const httpServer = http.createServer(app);

httpServer.listen(process.env.PORT || 8000, () => {
  console.log('Server started at ', process.env.PORT || 8000);
});

const io = require("socket.io")(httpServer, {
  cors: {
    origin: "*", 
  },
});

const users = {}; 
const userRooms = {}; // Track rooms users are in

io.on("connection", (socket) => {
  socket.on("new-user-joined", (name) => {
    users[socket.id] = name;
    socket.broadcast.emit("user-joined", name);
  });

  socket.on("join-private-chat", (otherUserId) => {
    const roomId = [socket.id, otherUserId].sort().join('-');
    socket.join(roomId);

    // Keep track of room association 
    if (userRooms[socket.id]) {
      userRooms[socket.id].push(roomId);
    } else {
      userRooms[socket.id] = [roomId];
    }
  });

  socket.on("send-private-message", (message, otherUserId) => {
    const roomId = [socket.id, otherUserId].sort().join('-');
    socket.to(roomId).emit("receive-private-message", { 
      message: message, 
      name: users[socket.id] 
    });
  });

  socket.on('disconnect', () => {
    delete users[socket.id];
    // Clean up rooms the user was in (optional, if needed)
  });
}); 
