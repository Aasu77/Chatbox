require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer();

const io = new Server(server, { cors: {origin: "*"}});

let onlineUsers = [];

io.on("connection", (socket) => {
  console.log("new connection", socket.id);

  //listen to connection
  socket.on("addNewUser", (userId) => {
    !onlineUsers.some((user) => user.userId === userId) &&
      onlineUsers.push({
        userId,
        socketId: socket.id,
      });
    console.log("onlineUsers", onlineUsers);

    io.emit("getOnlineUsers", onlineUsers);
  });

  // add message

  socket.on("sendMessage", (message) => {
    const user = onlineUsers.find(
      (user) => user.userId === message.recipientId,
    );

    if (user) {
      io.to(user.socketId).emit("getMessage", message);
      io.to(user.socketId).emit("getNotification", {
        senderId: message.senderId,
        isRead: false,
        date: new Date(),
      });
    }
  });

  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);

    io.emit("getOnlineUsers", onlineUsers);
  });
});

server.listen(process.env.PORT, () => console.log(`Listening on ${process.env.PORT}`));
