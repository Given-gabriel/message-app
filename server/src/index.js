import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import cookieParser from "cookie-parser";
import auth from "./routes/auth.routes.js";
import chat from "./routes/message.routes.js";
import "dotenv/config";
import connectDB from "./config/db.js";
import { socketAuthMiddleware } from "./middlewares/auth.middleware.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
const PORT = process.env.PORT || 5000;

connectDB();

let onlineUsers = new Map();

io.use(socketAuthMiddleware);

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("addUser", (userId) => {
    onlineUsers.set(userId, socket.id);
    io.emit("getUsers", Array.from(onlineUsers.keys()));
  });

  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const receiverSocketId = onlineUsers.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("getMessage", { senderId, text });
    }
  });

  socket.on("disconnect", () => {
    for (let [userId, id] of onlineUsers.entries()) {
      if (id === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
    io.emit("getUsers", Array.from(onlineUsers.keys()));
    console.log("User disconnected:", socket.id);
  });
});

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", auth);
app.use("/api/chatwith", chat);

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
