// node server which will handle socket.io

const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const path = require('path')

app.use(require("cors")());
app.use('/', express.static(path.join(__dirname, 'public')));
app.get('test', (req, res) => {
  res.status('200');
  return res.send('Hello world');
})

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Method", "GET, POST, PUT, PATCH, DELETE");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   next();
// });

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
io.on("connection", (socket) => {
  socket.on("new-user-joined", (name) => {
    console.log("newuser ", name);

    users[socket.id] = name;
    socket.broadcast.emit("user-joined", name);
  });


  socket.on("send", (message) => {
    socket.broadcast.emit("receive", {
      message: message,
      name: users[socket.id],
    });
  });
});
