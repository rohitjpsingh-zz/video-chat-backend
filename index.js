const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Running");
});

io.on("connection", (socket) => {
  console.log("socket:",socket.id);
  // Send Socket Id to Client
  socket.emit("socketId", socket.id);

  // Recieve Peer Signal Data When Call User
  socket.on("callUser", ({ userToCall, signalData, from, name }) => {
    // Send Call User Data to Specific Client
    console.log("callUser:",userToCall,"name:",name);
    io.to(userToCall).emit("callUser", {
      signal: signalData,
      from,
      callerName:name,
    });
  });


  // Recieve Peer Signal Data When Accept Call
  socket.on("answerCall", ({ userToCall, signalData, from, name }) => {
    // Send Call User Data to Specific Client
    console.log("answerCall:",userToCall,"name:",name);
    
  });

});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
