const express = require("express");
const app = express();
const server = require("http").createServer(app);

// const http = require('http')
// const server = http.createrServer(app)

const cors = require("cors");
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});
app.use(cors());
app.use(express.json());

io.on("connection", (socket) => {
  socket.on("join-room", (data) => {
    // checks if a room already exists and , if it does it joins the existing room
    // else it creates a new one
    const roomExists = io.sockets.adapter.rooms.has(data.rivalEmail);

    const connectedClients = roomExists
      ? io.sockets.adapter.rooms.get(data.rivalEmail).size
      : undefined;

    if (connectedClients === 1) {
      socket.join(data.rivalEmail);
      console.log("joined existing room of ", data.rivalEmail);
      socket.emit("join-confirmation", {
        status: true,
        message: "Room joined successfully.",
        secondPlayer: true,
      });
      socket.to(data.rivalEmail).emit("play_game", { statement: "emitter to other" });
      socket
        .to(data.rivalEmail)
        .emit("join-confirmation", {
          secondPlayer: true,
          opponent: data.username,
          email: data.userEmail,
        });
    } else if (connectedClients === 2) {
      // display to the client that the room is already full
      socket.emit("join-confirmation", {
        success: false,
        message: "The game has already started.",
      });
    } else {
      // socket.join(data.userEmail);
      // socket.emit("join-confirmation", { success: true, message: "Waiting for the other player to join...", secondPlayer: false});
      // in the previous version, the second player data tells that the 2nd player hasn't joined
      socket.emit("join-confirmation", {
        success: false,
        message: "No game exists with that email id",
      });
      console.log(`created room for ${data.userEmail}`);
    }
  });

  socket.on("game-start", (payload) => {
    console.log("received game start", payload);
    socket
      .to(payload.roomname)
      .emit("game-start", { piece: payload.piece, xIsNext: payload.xIsNext });
  });

  socket.on('getRoomMembers', (roomName) => {
    const room = io.sockets.adapter.rooms.get(roomName);

    if (room) {
      const members = [...room]; // Convert the Set object to an array

      console.log(`Members in room ${roomName}:`, members);
      // You can emit the member list to the client if needed
      // socket.emit('roomMembersList', members);
    } else {
      console.log(`Room ${roomName} does not exist.`);
    }
  });

  socket.on("username", (payload) => {
    io
      .to(payload.roomname)
      .emit("username", { username: payload.username });
  });

  socket.on("move", (payload) => {
    console.log("move received");
    const { squares, X, roomname } = payload;
    console.log(payload);
    try {
      if (socket.adapter.rooms.has(roomname)) {
        // Emit the "play" event to the room
        // socket.to(roomname).emit("play_game", { squares, X, statement: "emitter to other" });
        // io.emit("play", { squares, X, statement: "emitter to itself" });
        // Check if the event was successfully emitted
        const room = socket.adapter.rooms.get(roomname);
        const numClients = room ? room.size : 0;
        console.log(numClients)
        if (numClients > 1) {
          console.log(
            `"play" event emitted to room "${roomname}" successfully.`
          );
        } else {
          console.log(
            `Error: Room "${roomname}" does not have enough clients to emit the "play" event.`
          );
        }
      } else {
        console.log(`Error: Room "${roomname}" does not exist.`);
      }
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("create-game", (payload) => {
    socket.join(payload.userEmail);
    console.log("room created for", payload.userEmail);
    socket.emit("create-confirmation", { success: true });
  });
});

app.post("/move", (req, res) => {
  try {
    console.log("received from move");
    console.log(req.body);

    // io.socket.in(rivalEmail).emit('play', {  });
    res.status(200).json({ message: "hi" });
  } catch (err) {
    console.log("error during playing", err, req.body);
  }
});

server.listen(3000, () => console.log("server listening at port 3000"));
app.listen(4000, () => console.log("server listening at port 4000"));
