const express = require('express')
const app = express()
const server = require('http').createServer(app)
const cors = require("cors");
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  }
})
app.use(cors())
app.use(express.json())

io.on("connection", (socket) => {
  socket.on("join", (data) => {
    console.log(`created room for ${data.userEmail}`)
    socket.join(data.userEmail)
  })

  socket.on('move', (payload) => {
    console.log('move received')
    const {squaresCopy, X, piece, rivalEmail } = payload
    console.log(payload)
    socket.to(rivalEmail).emit('play', payload)
  }) 
})

app.post('/move', (req, res) => {
  try {
    console.log('received from move')
    console.log(req.body)
    
    // io.socket.in(rivalEmail).emit('play', {  });
    res.status(200).json({ message: "hi"})
  } catch(err) {
    console.log('error during playing', err, req.body)
  }
})


server.listen(3000, () => console.log('server listening at port 3000'))
app.listen(4000, () => console.log('server listening at port 4000'))
