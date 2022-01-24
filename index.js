// node server which will handle socket.io

const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");

app.use(require("cors")());

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Method", "GET, POST, PUT, PATCH, DELETE");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   next();
// });

const io = require("socket.io")(8000, {
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
