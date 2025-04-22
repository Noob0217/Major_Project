const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const { Server } = require("socket.io");
const http = require("http");
const Message = require("./messages");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // update this for production
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI = "mongodb+srv://noshitsherlock0709:jWaIgyiYtXGTXP7Q@cluster0.hicl3ns.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// ✅ WebSocket handling
io.on("connection", (socket) => {
  console.log("New client connected");

  // Load previous messages between two users
  socket.on("loadMessages", async ({ sender, receiver }) => {
    try {
      const messages = await Message.find({
        $or: [
          { sender, receiver },
          { sender: receiver, receiver: sender }
        ]
      }).sort({ timestamp: 1 });

      socket.emit("messageHistory", messages);  // Send message history to the client
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  });

  // Save new message to DB and send to all connected clients
  socket.on("sendMessage", async (data) => {
    try {
      // Log data to ensure it's correct
      console.log("Received message data:", data);

      // Log sender and receiver separately for easier debugging
      console.log("Sender: ", data.sender); // Log sender separately
      console.log("Receiver: ", data.receiver); // Log receiver separately

      const newMessage = new Message({
        sender: data.sender,
        receiver: data.receiver,
        message: data.message,  // Ensure this is the correct key
        timestamp: Date.now(),
      });

      // Save the message to MongoDB
      await newMessage.save();

      // Emit the new message to all clients
      io.emit("receiveMessage", {
        sender: data.sender,
        receiver: data.receiver,
        message: data.message,
        timestamp: data.timestamp,
      });
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// ✅ Base route
app.get("/", (req, res) => {
  res.send("Server is running");
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
